pipeline {
    agent any

    stages {
        // ===== FRONTEND BUILD =====
        stage('Build Frontend') {
            steps {
                // Go to frontend folder (must contain package.json)
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
                    REM === Remove old frontend if exists ===
                    if exist "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movie-frontend" (
                        rmdir /S /Q "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movie-frontend"
                    )

                    REM === Create new frontend folder in Tomcat ===
                    mkdir "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movie-frontend"

                    REM === Copy build output ===
                    xcopy /E /I /Y movie-frontend\\dist\\* "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movie-frontend"
                '''
            }
        }

        // ===== BACKEND BUILD =====
        stage('Build Backend') {
            steps {
                // Go to backend folder (must contain pom.xml)
                dir('movie-backend') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }
        
        // ===== BACKEND DEPLOY TO TOMCAT =====
        stage('Deploy Backend to Tomcat') {
            steps {
                bat '''
                    REM === Remove old WAR if exists ===
                    if exist "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movieapp.war" (
                        del "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movieapp.war"
                    )

                    REM === Copy new WAR ===
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
            echo "MovieApp pipeline failed. Check folder names and logs."
        }
    }
}
