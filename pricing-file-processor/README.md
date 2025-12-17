# Pricing File Processor

Lambda function que processa arquivos (CSV/Excel) do S3 e carrega produtos no DynamoDB.

## Funcionalidades

- ✅ Trigger automático quando arquivo é enviado ao S3
- ✅ Suporta arquivos CSV e Excel (.xlsx, .xls)
- ✅ Validação de dados com Zod
- ✅ Geração automática de UUID para cada produto
- ✅ BatchWrite no DynamoDB (até 25 itens por vez)
- ✅ Busca configurações do Secrets Manager
- ✅ Logs estruturados para CloudWatch
- ✅ Idempotência com hash de arquivo
- ✅ Limite de tamanho: 10MB

## Estrutura do Projeto

```
pricing-file-processor/
├── src/
│   ├── handlers/
│   │   └── s3-event.handler.ts       # Handler principal da Lambda
│   ├── services/
│   │   ├── s3.service.ts             # Leitura do S3
│   │   ├── dynamodb.service.ts       # BatchWrite DynamoDB
│   │   └── secrets-manager.service.ts # Busca configurações
│   ├── parsers/
│   │   ├── csv.parser.ts             # Parse CSV
│   │   └── excel.parser.ts           # Parse Excel
│   ├── validators/
│   │   └── product-schema.validator.ts # Schema Zod
│   └── utils/
│       ├── logger.ts                 # Logger estruturado
│       └── idempotency.ts            # Controle de duplicatas
├── package.json
└── tsconfig.json
```

## Formato do Arquivo

### CSV
```csv
name,description,price,quantity
Produto 1,Descrição do produto 1,99.90,10
Produto 2,Descrição do produto 2,149.90,5
```

### Excel
| name | description | price | quantity |
|------|-------------|-------|----------|
| Produto 1 | Descrição do produto 1 | 99.90 | 10 |
| Produto 2 | Descrição do produto 2 | 149.90 | 5 |

## Schema de Validação

```typescript
{
  name: string (obrigatório, min 1 caractere)
  description: string (obrigatório, min 1 caractere)
  price: number (positivo)
  quantity: number (inteiro >= 0)
}
```

Após validação, cada produto recebe:
- `id`: UUID v4 único
- `createdAt`: Timestamp ISO 8601
- `updatedAt`: null

## Instalação

```bash
npm install
```

## Build

```bash
npm run build
```

## Configuração

### Variáveis de Ambiente

- `AWS_REGION`: Região AWS (padrão: us-east-1)
- `SECRET_NAME`: Nome do secret no Secrets Manager (padrão: hands-on-aws/database)
- `LOG_LEVEL`: Nível de log (DEBUG para logs detalhados)

### Secrets Manager

O secret deve conter:
```json
{
  "PRODUCTS_TABLE_NAME": "ProductsTable"
}
```

## Permissões IAM Necessárias

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::your-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": ["dynamodb:BatchWriteItem"],
      "Resource": "arn:aws:dynamodb:*:*:table/ProductsTable"
    },
    {
      "Effect": "Allow",
      "Action": ["secretsmanager:GetSecretValue"],
      "Resource": "arn:aws:secretsmanager:*:*:secret:hands-on-aws/database-*"
    }
  ]
}
```

## Deploy

Configure sua função Lambda com:
- Runtime: Node.js 20.x
- Memory: 512 MB
- Timeout: 300 segundos (5 minutos)
- Trigger: S3 ObjectCreated (*.csv, *.xlsx)

## Logs

Logs estruturados em JSON no CloudWatch:

```json
{
  "level": "INFO",
  "message": "Processing complete",
  "bucket": "my-bucket",
  "key": "products.csv",
  "totalRecords": 100,
  "successfulInserts": 95,
  "failedValidations": 5,
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

## Tratamento de Erros

- Erros de validação são logados mas não impedem o processamento dos itens válidos
- Erros críticos (S3, DynamoDB, Secrets Manager) fazem a Lambda falhar
- Configure uma Dead Letter Queue (DLQ) para reprocessamento de falhas
