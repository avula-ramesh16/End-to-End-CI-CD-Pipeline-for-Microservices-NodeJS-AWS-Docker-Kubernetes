# 🚀 End-to-End CI/CD Pipeline for Node.js Microservices using Jenkins, Docker, Kubernetes & AWS

This project demonstrates a **production-grade CI/CD pipeline** built for deploying **Node.js-based microservices** on **Kubernetes (EKS)** using **Jenkins** as the automation tool.  
It covers the complete DevOps lifecycle — from code commit to automated deployment in AWS cloud.

---

## 🧩 Tech Stack

| Component | Technology |
|------------|-------------|
| **Application** | Node.js Microservices |
| **Version Control** | GitHub |
| **CI/CD Tool** | Jenkins |
| **Containerization** | Docker |
| **Image Registry** | AWS Elastic Container Registry (ECR) |
| **Orchestration** | Kubernetes (Amazon EKS) |
| **Infrastructure** | AWS |
| **Build & Deploy** | Jenkins Pipeline (Declarative Jenkinsfile) |

---

## ⚙️ Pipeline Overview

The CI/CD Pipeline performs the following stages automatically:

1. **Checkout Code** – Clone source code from GitHub repository.  
2. **Build Stage** – Build Docker images for each microservice.  
3. **Push to ECR** – Push Docker images to AWS ECR registry.  
4. **Deploy to EKS** – Apply Kubernetes manifests and update the running services.  
5. **Verification** – Ensure Pods and LoadBalancer services are up and healthy.

---

### 🧱 1️⃣ Jenkins Dashboard
> *Shows Jenkins home page with configured pipeline job.*

<img width="1899" height="857" alt="image" src="https://github.com/user-attachments/assets/5422dc88-bd10-4075-ace7-8cb90901c71c" />


---

### ⚙️ 2️⃣ Job Configuration
> *Displays Jenkins job setup — GitHub repository integration and Jenkinsfile path.*

<img width="940" height="683" alt="image" src="https://github.com/user-attachments/assets/85e3caeb-eb5b-4fcc-9926-7ee8b591ce2a" />

---

### 🧩 3️⃣ Kubernetes Pods
<img width="960" height="155" alt="image" src="https://github.com/user-attachments/assets/48aa2b7a-4340-480b-96f9-2be076066b2e" />

### 🧩 4️⃣ Kubernetes Load Balancers
<img width="1553" height="322" alt="image" src="https://github.com/user-attachments/assets/059d5e09-f45d-4221-807d-ca4b32cda00e" />

### 🧩 5️⃣ Jenkins Pipeline Overview
<img width="1880" height="871" alt="image" src="https://github.com/user-attachments/assets/bd7f48d0-4e66-48b7-aca7-948274682bfe" />

🧰 Commands Used
🐳 Docker Commands
docker build -t users-service .
docker build -t products-service .

📦 Push to AWS ECR
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/users-service:latest

☸️ Kubernetes Commands
kubectl apply -f k8s/
kubectl get pods -n demo
kubectl get svc -n demo
kubectl get deploy -n demo

