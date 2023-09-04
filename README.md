# starter-hugo

## How to use this template

- Click on "Use this template"
- Select "Include all branches"
- Add Labanqui.se/core-team to team members on newly created repository
- Go to dev branch to get next instructions

## Prerequisites


- Install AWS CLI : https://docs.aws.amazon.com/fr_fr/cli/latest/userguide/getting-started-install.html
- Install Docker + Docker Compose : https://docs.docker.com/engine/install/

## How to start a project

- Update .env

  - PORT=1313 (Leave it at default value)
  - APP_NAME
  - REGION (Only if required, default is "eu-west-3")
  - Dev environment :
    Replace with your own values, following the same format :
    - DEV_PROJECT_NAME=dev-projectname (No special characters allowed here)
    - DEV_BUCKET_NAME=dev-projectname.labanqui.se (Must end with .labanqui.se)
    - DEV_HOSTED_ZONE_NAME=labanqui.se (The domain name must be the same as the one in the end of the bucket name)
  - PROD (optional for development):
    Replace with your own values, following the same format
    - PROD_PROJECT_NAME=prod-projectname (No special characters allowed here)
    - PROD_BUCKET_NAME=www.project.url (www prefix needed here)
    - PROD_HOSTED_ZONE_NAME=project.url (The domain name must be the same as the one in the end of the bucket name)
    - PROD_ACM_CERTIFICATE_ARN=Get Certificate ARN Here : https://us-east-1.console.aws.amazon.com/acm/home?region=us-east-1#/certificates/list
  - GITHUB : The url of your newly created project, ending with .git
  - TENANT : Your tenant name

- Update config-dev.toml and config-prod.toml with the right baseURL, title, tenant and description
- `npm i -g prettier prettier-plugin-go-template`
- `make init` (start docker before with `sudo service docker start`)
- Update run.sh with your current crystallize query
- Create a new branch from dev branch to start developing
- `make down start logs`
- Update extract folder to sanitize crystallize response
- Develop your website
- Merge your branch to dev to publish your work on dev environment
