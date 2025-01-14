import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { randomUUID } from 'node:crypto';
import { concatenateResourceName } from '../helpers';
import type { TestStack } from '../TestStack';
import type { TestDynamodbTableProps, ExtraTestProps } from './types';

/**
 * A DynamoDB Table that can be used in tests.
 *
 * It includes some default props and outputs the table name.
 */
class TestDynamodbTable extends Table {
  public constructor(
    stack: TestStack,
    props: TestDynamodbTableProps,
    extraProps: ExtraTestProps
  ) {
    super(stack.stack, `table-${randomUUID().substring(0, 5)}`, {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      ...props,
      tableName: concatenateResourceName({
        testName: stack.testName,
        resourceName: extraProps.nameSuffix,
      }),
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new CfnOutput(this, extraProps.nameSuffix, {
      value: this.tableName,
    });
  }
}

export { TestDynamodbTable, TestDynamodbTableProps };
