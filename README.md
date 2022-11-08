# Project Overview

Application consists of three components:

- frontend
- backend
- postgresql database

Frontend and backend services are built using Typescript and share the code in the `shared` folder.

# Building the project

Ensure you have access to `pnpm` package manager.

```shell
cd frontend
pnpm install
pnpm build
cd ../backend
pnpm install
pnpm build
cd ..
```

# Building the containers

Please first ensure that you have access to the images specified in the `docker-compose.yml`:

```yaml
  backend:
    build:
      context: ./backend/
    image: "devarcana/ttt-backend:latest"
```

In this case I am pushing directly to my private repository on Docker Hub named `devarcana/ttt-backend` with the tag `latest`.
Create the repository on Docker Hub first.

```shell
docker compose build
docker compose push
```

# Configure AWS CLI

First, go into AWS IAM page and create access key for a chosen user (root is not recommended).
I created a new user for accessing ECS from Docker CLI and called it `Docker`.
During user creation I selected `Access key - Programmatic access`.
I created an ad-hoc group `DockerUsers` and added the user to it.

Then, using AWS CLI:
```shell
aws configure
```

Entered the access key and secret from AWS console.
To check if it works:

```shell
aws sts get-caller-identity
```

```json
{
    "UserId": "AIDA2ZPXEA4ZI4OAEYZSG",
    "Account": "741936990002",
    "Arn": "arn:aws:iam::741936990002:user/Docker"
}
```

# Configure Docker CLI

Create an ECS context for Docker CLI and import identity from AWS credentials.

```shell
docker context create ecs aws
docker context use aws
```

# Configuring access

By default running `docker-compose up` inside the project's folder will cause an error due to insufficient permissions:
```
AccessDeniedException: User: arn:aws:iam::741936990002:user/Docker is not authorized to perform: ecs:ListAccountSettings on resource: * because no identity-based policy allows the ecs:ListAccountSettings action
```

A policy is needed for the newly created user group granting access to the necessary permissions:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "docker",
			"Effect": "Allow",
			"Action": [
				"cloudformation:*",
				"servicediscovery:*",
				"elasticloadbalancing:*",
				"ecs:ListAccountSettings",
				"ecs:DescribeClusters",
				"ecs:DescribeServices",
				"ecs:ListTasks",
				"ecs:DescribeTasks",
				"ecs:RegisterTaskDefinition",
				"ecs:DeregisterTaskDefinition",
				"ecs:CreateCluster",
				"ecs:DeleteCluster",
				"ecs:CreateService",
				"ecs:DeleteService",
				"ec2:DescribeVpcs",
				"ec2:DescribeSubnets",
				"ec2:DescribeSecurityGroups",
				"ec2:Describe*",
				"ec2:CreateSecurityGroup",
				"ec2:DeleteSecurityGroup",
				"ec2:CreateTags",
				"ec2:DeleteTags",
				"ec2:AuthorizeSecurityGroupIngress",
				"ec2:RevokeSecurityGroupIngress",
				"iam:CreateRole",
				"iam:DeleteRole",
				"iam:PassRole",
				"iam:AttachRolePolicy",
				"iam:DetachRolePolicy",
				"logs:DescribeLogGroups",
				"logs:FilterLogEvents",
				"logs:CreateLogGroup",
				"logs:DeleteLogGroup",
				"route53:ListHostedZonesByName",
				"route53:GetHealthCheck",
				"route53:GetHostedZone",
				"route53:CreateHostedZone",
				"route53:DeleteHostedZone"
			],
			"Resource": "*"
		}
	]
}
```

The policy was named `DockerPolicy` and attached to `DockerUsers`.

# Problem

At this point I gave up with trying to use the approach with IAM policies.
I created an access key for root user.

```json
{
  "UserId": "741936990002",
  "Account": "741936990002",
  "Arn": "arn:aws:iam::741936990002:root"
}
```

# Running the project

```shell
docker-compose up
```

At this point I received another error related to the "essential container quitting".
This was due to building the containers on the Apple Silicon ARM architecture.
Use [Colima](https://github.com/abiosoft/colima) docker backend to build the containers for x64 architecture.

Finally, everything worked fine:

```shell
❯ docker compose up
WARNING services.build: unsupported attribute
WARNING services.scale: unsupported attribute
WARNING services.build: unsupported attribute
WARNING services.scale: unsupported attribute
WARNING services.scale: unsupported attribute
[+] Running 25/25
 ⠿ pwr-zrcaw                      CreateComplete                                                                                               365.5s
 ⠿ BackendTCP3001TargetGroup      CreateComplete                                                                                                 2.1s
 ⠿ LoadBalancer                   CreateComplete                                                                                               153.2s
 ⠿ FrontendTCP80TargetGroup       CreateComplete                                                                                                 1.0s
 ⠿ DefaultNetwork                 CreateComplete                                                                                                 6.0s
 ⠿ CloudMap                       CreateComplete                                                                                                47.1s
 ⠿ BackendTaskExecutionRole       CreateComplete                                                                                                20.1s
 ⠿ PostgresTaskExecutionRole      CreateComplete                                                                                                20.1s
 ⠿ FrontendTaskExecutionRole      CreateComplete                                                                                                20.1s
 ⠿ LogGroup                       CreateComplete                                                                                                 3.0s
 ⠿ Cluster                        CreateComplete                                                                                                 6.0s
 ⠿ Default80Ingress               CreateComplete                                                                                                 1.0s
 ⠿ Default3001Ingress             CreateComplete                                                                                                 1.1s
 ⠿ DefaultNetworkIngress          CreateComplete                                                                                                 1.1s
 ⠿ BackendTaskDefinition          CreateComplete                                                                                                 3.1s
 ⠿ PostgresTaskDefinition         CreateComplete                                                                                                 3.1s
 ⠿ FrontendTaskDefinition         CreateComplete                                                                                                 3.1s
 ⠿ FrontendServiceDiscoveryEntry  CreateComplete                                                                                                 2.0s
 ⠿ BackendServiceDiscoveryEntry   CreateComplete                                                                                                 2.0s
 ⠿ PostgresServiceDiscoveryEntry  CreateComplete                                                                                                 2.0s
 ⠿ PostgresService                CreateComplete                                                                                                86.9s
 ⠿ FrontendTCP80Listener          CreateComplete                                                                                                 2.1s
 ⠿ BackendTCP3001Listener         CreateComplete                                                                                                 2.1s
 ⠿ BackendService                 CreateComplete                                                                                               108.9s
 ⠿ FrontendService                CreateComplete                                                                                                86.7s
❯ docker compose ps
NAME                                              COMMAND             SERVICE             STATUS              PORTS
task/pwr-zrcaw/19adf2415d314b349a394a6d22bc10cb   ""                  postgres            Running
task/pwr-zrcaw/72017a7200744c2a95a40b930acb4250   ""                  frontend            Running             pwr-z-LoadB-YPMZSO5U5YSX-c7e3c2a08c4466da.elb.us-east-1.amazonaws.com:80:80->80/tcp
task/pwr-zrcaw/912ee7dd640b403480c901cd757f165e   ""                  backend             Running             pwr-z-LoadB-YPMZSO5U5YSX-c7e3c2a08c4466da.elb.us-east-1.amazonaws.com:3001:3001->3001/tcp
```

