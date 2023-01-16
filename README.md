# RDS Backups

In order to create a backup of the application's database, I opened the RDS console and selected my database `db-tic-tac-toe`.
Then I chose the `Take snapshot` option from the collapsible `Actions` menu.
For the name of the snapshot I used `ttt-16-01-2023`.
The database is configured to automatically take a snapshot periodically so this name allows me to differentiate the automatic snapshots from the manual one.
After that the status of the snapshot became `Creating` and soon transitioned to `Available`.

In the meanwhile I opened the `Key Management Service` with the intention to create a new key that will be used to encrypt the backup saved to S3 later.
I opened the `Customer managed keys` tab and clicked on `Create key`.
I chose the `Symmetric` key type and `Encrypt and decrypt` usage option.
For the alias I set the value to `rds-tic-tac-toe-backup`.

Immedietely I encountered the first hurdle:

```
ListUsers request failed
AccessDenied - User: arn:aws:sts::088582823373:assumed-role/voclabs/user2196238=Piotr_Krzystanek is not authorized to perform: iam:ListUsers on resource: arn:aws:iam::088582823373:user/ because no identity-based policy allows the iam:ListUsers action
```

From the list of users to become the *key administrators* I actually selected everyone just to try and be safe.
Previously I tried selecting only `LabRole` but that failed due to inability of the backup service to assume the role.
Likewise for *key usage permissions* I selected everyone.

The resulting *key policy* was:

```json
{
    "Id": "key-consolepolicy-3",
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Enable IAM User Permissions",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::088582823373:root"
            },
            "Action": "kms:*",
            "Resource": "*"
        },
        {
            "Sid": "Allow access for Key Administrators",
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "arn:aws:iam::088582823373:role/EMR_AutoScaling_DefaultRole",
                    "arn:aws:iam::088582823373:role/EMR_DefaultRole",
                    "arn:aws:iam::088582823373:role/EMR_EC2_DefaultRole",
                    "arn:aws:iam::088582823373:role/LabRole",
                    "arn:aws:iam::088582823373:role/myRedshiftRole",
                    "arn:aws:iam::088582823373:role/robomaker_students",
                    "arn:aws:iam::088582823373:role/vocareum",
                    "arn:aws:iam::088582823373:role/voclabs",
                    "arn:aws:iam::088582823373:role/vocstartsoft",
                    "arn:aws:iam::088582823373:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling",
                    "arn:aws:iam::088582823373:role/aws-service-role/cloud9.amazonaws.com/AWSServiceRoleForAWSCloud9",
                    "arn:aws:iam::088582823373:role/aws-service-role/events.amazonaws.com/AWSServiceRoleForCloudWatchEvents",
                    "arn:aws:iam::088582823373:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS",
                    "arn:aws:iam::088582823373:role/aws-service-role/elasticache.amazonaws.com/AWSServiceRoleForElastiCache",
                    "arn:aws:iam::088582823373:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing",
                    "arn:aws:iam::088582823373:role/aws-service-role/organizations.amazonaws.com/AWSServiceRoleForOrganizations",
                    "arn:aws:iam::088582823373:role/aws-service-role/rds.amazonaws.com/AWSServiceRoleForRDS",
                    "arn:aws:iam::088582823373:role/aws-service-role/support.amazonaws.com/AWSServiceRoleForSupport",
                    "arn:aws:iam::088582823373:role/aws-service-role/trustedadvisor.amazonaws.com/AWSServiceRoleForTrustedAdvisor"
                ]
            },
            "Action": [
                "kms:Create*",
                "kms:Describe*",
                "kms:Enable*",
                "kms:List*",
                "kms:Put*",
                "kms:Update*",
                "kms:Revoke*",
                "kms:Disable*",
                "kms:Get*",
                "kms:Delete*",
                "kms:TagResource",
                "kms:UntagResource",
                "kms:ScheduleKeyDeletion",
                "kms:CancelKeyDeletion"
            ],
            "Resource": "*"
        },
        {
            "Sid": "Allow use of the key",
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "arn:aws:iam::088582823373:role/EMR_AutoScaling_DefaultRole",
                    "arn:aws:iam::088582823373:role/EMR_DefaultRole",
                    "arn:aws:iam::088582823373:role/EMR_EC2_DefaultRole",
                    "arn:aws:iam::088582823373:role/LabRole",
                    "arn:aws:iam::088582823373:role/myRedshiftRole",
                    "arn:aws:iam::088582823373:role/robomaker_students",
                    "arn:aws:iam::088582823373:role/vocareum",
                    "arn:aws:iam::088582823373:role/voclabs",
                    "arn:aws:iam::088582823373:role/vocstartsoft",
                    "arn:aws:iam::088582823373:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling",
                    "arn:aws:iam::088582823373:role/aws-service-role/cloud9.amazonaws.com/AWSServiceRoleForAWSCloud9",
                    "arn:aws:iam::088582823373:role/aws-service-role/events.amazonaws.com/AWSServiceRoleForCloudWatchEvents",
                    "arn:aws:iam::088582823373:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS",
                    "arn:aws:iam::088582823373:role/aws-service-role/elasticache.amazonaws.com/AWSServiceRoleForElastiCache",
                    "arn:aws:iam::088582823373:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing",
                    "arn:aws:iam::088582823373:role/aws-service-role/organizations.amazonaws.com/AWSServiceRoleForOrganizations",
                    "arn:aws:iam::088582823373:role/aws-service-role/rds.amazonaws.com/AWSServiceRoleForRDS",
                    "arn:aws:iam::088582823373:role/aws-service-role/support.amazonaws.com/AWSServiceRoleForSupport",
                    "arn:aws:iam::088582823373:role/aws-service-role/trustedadvisor.amazonaws.com/AWSServiceRoleForTrustedAdvisor"
                ]
            },
            "Action": [
                "kms:Encrypt",
                "kms:Decrypt",
                "kms:ReEncrypt*",
                "kms:GenerateDataKey*",
                "kms:DescribeKey"
            ],
            "Resource": "*"
        },
        {
            "Sid": "Allow attachment of persistent resources",
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "arn:aws:iam::088582823373:role/EMR_AutoScaling_DefaultRole",
                    "arn:aws:iam::088582823373:role/EMR_DefaultRole",
                    "arn:aws:iam::088582823373:role/EMR_EC2_DefaultRole",
                    "arn:aws:iam::088582823373:role/LabRole",
                    "arn:aws:iam::088582823373:role/myRedshiftRole",
                    "arn:aws:iam::088582823373:role/robomaker_students",
                    "arn:aws:iam::088582823373:role/vocareum",
                    "arn:aws:iam::088582823373:role/voclabs",
                    "arn:aws:iam::088582823373:role/vocstartsoft",
                    "arn:aws:iam::088582823373:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling",
                    "arn:aws:iam::088582823373:role/aws-service-role/cloud9.amazonaws.com/AWSServiceRoleForAWSCloud9",
                    "arn:aws:iam::088582823373:role/aws-service-role/events.amazonaws.com/AWSServiceRoleForCloudWatchEvents",
                    "arn:aws:iam::088582823373:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS",
                    "arn:aws:iam::088582823373:role/aws-service-role/elasticache.amazonaws.com/AWSServiceRoleForElastiCache",
                    "arn:aws:iam::088582823373:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing",
                    "arn:aws:iam::088582823373:role/aws-service-role/organizations.amazonaws.com/AWSServiceRoleForOrganizations",
                    "arn:aws:iam::088582823373:role/aws-service-role/rds.amazonaws.com/AWSServiceRoleForRDS",
                    "arn:aws:iam::088582823373:role/aws-service-role/support.amazonaws.com/AWSServiceRoleForSupport",
                    "arn:aws:iam::088582823373:role/aws-service-role/trustedadvisor.amazonaws.com/AWSServiceRoleForTrustedAdvisor"
                ]
            },
            "Action": [
                "kms:CreateGrant",
                "kms:ListGrants",
                "kms:RevokeGrant"
            ],
            "Resource": "*",
            "Condition": {
                "Bool": {
                    "kms:GrantIsForAWSResource": "true"
                }
            }
        }
    ]
}
```

The generated key's *ARN* was `arn:aws:kms:us-east-1:088582823373:key/8c8e559f-b983-4876-a89f-e073a147ef8e`.

Going back to RDS I saw that the backup was completed and I could proceeed with the export to S3.
First, I clicked on the snapshot name and opened its details.
From there, I chose the `Export to Amazon S3` option.
For the *export identifier* I chose the same name as the snapshot: `ttt-16-01-2023`.
I left most of the settings by default, taking care to change the IAM role to `LabRole` and the KMS key to `rds-tic-tac-toe-backup`.
This caused the following error to appear:

```
The principal export.rds.amazonaws.com isn't allowed to assume the IAM role arn:aws:iam::088582823373:role/LabRole or the IAM role arn:aws:iam::088582823373:role/LabRole doesn't exist.
```

And creation of a new role also failed:

```
User: arn:aws:sts::088582823373:assumed-role/voclabs/user2196238=Piotr_Krzystanek is not authorized to perform: iam:CreatePolicy on resource: policy export2023-01-16-13.45.26.022 because no identity-based policy allows the iam:CreatePolicy action
```

The only option left to try was to restore the snapshot directly.
This lead to the creation of a new database I called `restored-database`.
This operation creates a new database with the contents taken from the saved snapshot instead of rolling back the state of the original database.

# Cloudwatch

First, I navigated to the following location in AWS:
`Cloudwatch > Getting started > Create a dashboard`

For the name of the dashboard I chose `tic-tac-toe-dashboard`.
I added an `Explorer` widget and set the type to `pre-filled` with *Elastic Beanstalk* template.

Again encountered a problem when trying to open the details of the environment:

```
A problem occurred while loading your page: User: arn:aws:sts::088582823373:assumed-role/voclabs/user2196238=Piotr_Krzystanek is not authorized to perform: autoscaling:DescribeAutoScalingGroups because no identity-based policy allows the autoscaling:DescribeAutoScalingGroups action
```