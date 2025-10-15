pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '787068570726'
        ECR_USERS = 'users'
        ECR_PRODUCTS = 'products'
        CLUSTER_NAME = 'demo-cluster'
        NAMESPACE = 'demo'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/avula-ramesh16/End-to-End-CI-CD-Pipeline-for-Microservices-NodeJS-AWS-Docker-Kubernetes.git'
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
                withAWS(credentials: 'aws-login', region: "us-east-1") {
                    sh """
                    aws ecr get-login-password | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    """
                }
            }
        }

        stage('Tag & Push Images to ECR') {
            steps {
                withAWS(credentials: 'aws-login', region: "${AWS_REGION}") {
                    sh """
                    docker tag ${ECR_USERS}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_USERS}:latest
                    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_USERS}:latest

                    docker tag ${ECR_PRODUCTS}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_PRODUCTS}:latest
                    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_PRODUCTS}:latest
                    """
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                withAWS(credentials: 'aws-login', region: "${AWS_REGION}") {
                    sh """
                    aws eks update-kubeconfig --name ${CLUSTER_NAME}

                    sed -i "s#<AWS_ACCOUNT_ID>#${AWS_ACCOUNT_ID}#g" k8s/*.yaml
                    sed -i "s#<AWS_REGION>#${AWS_REGION}#g" k8s/*.yaml

                    kubectl apply -f k8s/namespace.yaml
                    kubectl apply -f k8s/users-deployment.yaml
                    kubectl apply -f k8s/products-deployment.yaml
                    """
                }
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
