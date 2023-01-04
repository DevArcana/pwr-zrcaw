# Migration to ECR

In `docker-compose.yml` I configured the image names to include the ECR prefix:

```yml
  backend:
    image: "088582823373.dkr.ecr.us-east-1.amazonaws.com/ttt-backend:latest"

  frontend:
    image: "088582823373.dkr.ecr.us-east-1.amazonaws.com/ttt-frontend:latest"
```

Then I authenticated to the ECR using the following command:

```shell
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 088582823373.dkr.ecr.us-east-1.amazonaws.com
```

Finally, build and push the images as usual:

```shell
docker compose build
docker compose push
```

# Migrating to beanstalk

Excerpt from the documentation:

```
AWS Elastic Beanstalk
• This service can assume the LabRole IAM role.
• To create an application: choose Create Application, give it an application name, choose a
platform, then choose Configure more options. Scroll down to the Security panel and choose
Edit. For Service role, choose LabRole. If the environment is in the us-east-1 AWS Region, for
EC2 key pair, choose vockey and for IAM instance profile, choose LabInstanceProfile. Choose
Save, then choose Create app.
• Supported instance types: nano, micro, small, medium, and large. If you attempt to launch a
larger instance type, it will be terminated.
```

I followed the instructions and created the application with default environment. Then, using the `eb cli` I initialized the configuration files in the local repository to point at the created app.

```shell
❯ eb init

Select a default region
1) us-east-1 : US East (N. Virginia)
2) us-west-1 : US West (N. California)
3) us-west-2 : US West (Oregon)
4) eu-west-1 : EU (Ireland)
5) eu-central-1 : EU (Frankfurt)
6) ap-south-1 : Asia Pacific (Mumbai)
7) ap-southeast-1 : Asia Pacific (Singapore)
8) ap-southeast-2 : Asia Pacific (Sydney)
9) ap-northeast-1 : Asia Pacific (Tokyo)
10) ap-northeast-2 : Asia Pacific (Seoul)
11) sa-east-1 : South America (Sao Paulo)
12) cn-north-1 : China (Beijing)
13) cn-northwest-1 : China (Ningxia)
14) us-east-2 : US East (Ohio)
15) ca-central-1 : Canada (Central)
16) eu-west-2 : EU (London)
17) eu-west-3 : EU (Paris)
18) eu-north-1 : EU (Stockholm)
19) eu-south-1 : EU (Milano)
20) ap-east-1 : Asia Pacific (Hong Kong)
21) me-south-1 : Middle East (Bahrain)
22) af-south-1 : Africa (Cape Town)
(default is 3): 1


Select an application to use
1) tic-tac-toe
2) [ Create new Application ]
(default is 2): 1

Do you wish to continue with CodeCommit? (Y/n): n
```

To deploy the application, I needed to modify the `docker-compose.yml` file to remove the `build` section.
I backed up the original file to `docker-compose.build.yml` and removed `build` sections from `docker-compose.yml`.
With that done, I could deploy the source code using `eb deploy`:

```shell
eb deploy
```

The application was deployed correctly and I could finally connect to it.

# Migrating to RDS

So far I have been using an ephemeral postgres container for the database which meant losing the scoreboard each deployment.

I created RDS postgres database in the [dashboard](https://us-east-1.console.aws.amazon.com/rds/home?region=us-east-1#launch-dbinstance:gdb=false;s3-import=false).
For the size, I chose "free-tier". The name was set to "db-tic-tac-toe".
The minimum storage I set to 20GB and disabled storage autoscaling.
I also disabled monitoring as per instructions for the learning lab.
I used the "Set up EC2 connection" option and chose "Tictactoe-env-1" from the list.

Finally, in the Beanstalk console, I chose "Configuration", then "Software" and at the bottom filled in the necessary environment variables pertaining to the database connection.

The settings are based on the RDS console and look as follows:

```
DATABASE_HOST: "db-tic-tac-toe.cjzw0zlfjudw.us-east-1.rds.amazonaws.com"
DATABASE_PORT: "5432"
DATABASE_USERNAME: "postgres"
DATABASE_PASSWORD: "*password*"
DATABASE_NAME: "test"
```

After that it was time to delete the database service from `docker-compose.yml` altogether.
The final version of `docker-compose.yml` looked like so:

```yml
version: '3'
services:
  backend:
    image: "088582823373.dkr.ecr.us-east-1.amazonaws.com/ttt-backend:latest"
    container_name: "ttt-backend"
    depends_on:
      - postgres

  frontend:
    image: "088582823373.dkr.ecr.us-east-1.amazonaws.com/ttt-frontend:latest"
    container_name: "ttt-frontend"
    ports:
      - "80:80"
    depends_on:
      - backend
```

Finaly deployment and I could test if the app still worked as expected.
The app works just as before.