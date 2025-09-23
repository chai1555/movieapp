pipeline {
    agent any

    stages {
        // ===== FRONTEND BUILD =====
        stage('Build Frontend') {
            steps {
                // Navigate to frontend project folder and build
                dir('movie-frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }
        
        // ===== FRONTEND DEPLOY TO TOMCAT =====
        stage('Deploy Frontend to Tomcat') {
            steps {
                bat '''
                    REM === Remove old frontend deployment if exists ===
                    if exist "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movie-frontend" (
                        rmdir /S /Q "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movie-frontend"
                    )

                    REM === Create new frontend folder in Tomcat webapps ===
                    mkdir "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movie-frontend"

                    REM === Copy build output to Tomcat webapps ===
                    xcopy /E /I /Y movie-frontend\\dist\\* "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movie-frontend"
                '''
            }
        }

        // ===== BACKEND BUILD =====
        stage('Build Backend') {
            steps {
                // Navigate to backend project folder and package with Maven
                dir('movie-backend') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }
        
        // ===== BACKEND DEPLOY TO TOMCAT =====
        stage('Deploy Backend to Tomcat') {
            steps {
                bat '''
                    REM === Remove old backend WAR if exists ===
                    if exist "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movieapp.war" (
                        del "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movieapp.war"
                    )

                    REM === Copy new backend WAR to Tomcat webapps ===
                    copy movie-backend\\target\\movieapp.war "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\"
                '''
            }
        }
    }

    post {
        success {
            echo "MovieApp pipeline completed successfully."
        }
        failure {
            echo "MovieApp pipeline failed."
        }
    }
}
