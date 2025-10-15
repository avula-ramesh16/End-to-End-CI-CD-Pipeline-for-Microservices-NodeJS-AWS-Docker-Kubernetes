pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '787068570726'   // 👈 Replace with your AWS Account ID
        ECR_USERS = 'users'
        ECR_PRODUCTS = 'products'
        CLUSTER_NAME = 'demo-cluster'
        NAMESPACE = 'demo'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/avula-ramesh16/End-to-End-CI-CD-Pipeline-for-Microservices-NodeJS-AWS-Docker-Kubernetes.git'
            }
        }

        stage('Create ECR Repositories if not exists') {
            steps {
                sh """
                # Check and create 'users' repo if not exists
                if ! aws ecr describe-repositories --repository-names ${ECR_USERS} --region ${AWS_REGION} >/dev/null 2>&1; then
                  echo "ECR repository '${ECR_USERS}' does not exist. Creating..."
                  aws ecr create-repository --repository-name ${ECR_USERS} --region ${AWS_REGION}
                else
                  echo "ECR repository '${ECR_USERS}' already exists."
                fi

                # Check and create 'products' repo if not exists
                if ! aws ecr describe-repositories --repository-names ${ECR_PRODUCTS} --region ${AWS_REGION} >/dev/null 2>&1; then
                  echo "ECR repository '${ECR_PRODUCTS}' does not exist. Creating..."
                  aws ecr create-repository --repository-name ${ECR_PRODUCTS} --region ${AWS_REGION}
                else
                  echo "ECR repository '${ECR_PRODUCTS}' already exists."
                fi
                """
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                docker build -t ${ECR_USERS}:latest services/users
                docker build -t ${ECR_PRODUCTS}:latest services/products
                """
            }
        }

        stage('Login to ECR') {
            steps {
                sh """
                aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                """
            }
        }

        stage('Tag & Push Images to ECR') {
            steps {
                sh """
                docker tag ${ECR_USERS}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_USERS}:latest
                docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_USERS}:latest

                docker tag ${ECR_PRODUCTS}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_PRODUCTS}:latest
                docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_PRODUCTS}:latest
                """
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh """
                aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${AWS_REGION}

                sed -i "s#<AWS_ACCOUNT_ID>#${AWS_ACCOUNT_ID}#g" k8s/*.yaml
                sed -i "s#<AWS_REGION>#${AWS_REGION}#g" k8s/*.yaml

                kubectl apply -f k8s/namespace.yaml
                kubectl apply -f k8s/users-deployment.yaml
                kubectl apply -f k8s/products-deployment.yaml
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
