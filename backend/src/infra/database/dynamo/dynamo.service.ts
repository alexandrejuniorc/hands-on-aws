import { env } from "@/infra/env/env"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  ScanCommand,
  ScanCommandInput,
  DeleteCommand,
  DeleteCommandInput,
  QueryCommand,
  QueryCommandInput,
  PutCommand,
  PutCommandInput,
  GetCommand,
  GetCommandInput,
} from "@aws-sdk/lib-dynamodb"

export class DynamoService {
  private client: DynamoDBClient
  private docClient: DynamoDBDocumentClient

  constructor() {
    const region = env.AWS_REGION_PRICING
    const accessKeyId = env.AWS_ACCESS_KEY_ID
    const secretAccessKey = env.AWS_SECRET_ACCESS_KEY

    this.client = new DynamoDBClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })

    this.docClient = DynamoDBDocumentClient.from(this.client, {
      marshallOptions: { removeUndefinedValues: true },
    })
  }

  async scan(
    tableName: string,
    options?: {
      limit?: number
      lastEvaluatedKey?: Record<string, any>
      filters?: Record<string, any>
    },
  ) {
    const params: ScanCommandInput = {
      TableName: tableName,
    }

    if (options?.limit) {
      params.Limit = options.limit
    }

    if (options?.lastEvaluatedKey) {
      params.ExclusiveStartKey = options.lastEvaluatedKey
    }

    if (options?.filters) {
      const filterExpressions: string[] = []
      const expressionAttributeNames: Record<string, string> = {}
      const expressionAttributeValues: Record<string, any> = {}

      Object.entries(options.filters).forEach(([key, value], index) => {
        const attrName = `#attr${index}`
        const attrValue = `:val${index}`
        filterExpressions.push(`${attrName} = ${attrValue}`)
        expressionAttributeNames[attrName] = key
        expressionAttributeValues[attrValue] = value
      })

      params.FilterExpression = filterExpressions.join(" AND ")
      params.ExpressionAttributeNames = expressionAttributeNames
      params.ExpressionAttributeValues = expressionAttributeValues
    }

    const command = new ScanCommand(params)
    const response = await this.docClient.send(command)

    return {
      items: response.Items || [],
      count: response.Count || 0,
      lastEvaluatedKey: response.LastEvaluatedKey,
    }
  }

  async create(tableName: string, item: Record<string, any>) {
    const params: PutCommandInput = {
      TableName: tableName,
      Item: item,
    }

    const command = new PutCommand(params)
    await this.docClient.send(command)
  }

  async findById(tableName: string, id: string) {
    const params: GetCommandInput = {
      TableName: tableName,
      Key: { id },
    }

    const command = new GetCommand(params)
    const response = await this.docClient.send(command)

    return response.Item || null
  }

  async query(
    tableName: string,
    indexName: string,
    keyConditionExpression: string,
    expressionAttributeNames: Record<string, string>,
    expressionAttributeValues: Record<string, any>,
  ) {
    const params: QueryCommandInput = {
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }

    const command = new QueryCommand(params)
    const response = await this.docClient.send(command)

    return response.Items || []
  }

  async delete(tableName: string, key: Record<string, any>) {
    const params: DeleteCommandInput = {
      TableName: tableName,
      Key: key,
    }

    const command = new DeleteCommand(params)
    await this.docClient.send(command)
  }
}

export const dynamoService = new DynamoService()
