pipeline {
    agent any

    stages {
        // ===== FRONTEND BUILD =====
        stage('Build Frontend') {
            steps {
                // CORRECTED: Changed 'movie-frontend' to 'frontendapp'
                dir('frontendapp') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        // ===== FRONTEND DEPLOY =====
        stage('Deploy Frontend to Tomcat') {
            steps {
                bat '''
                    REM --- Remove old frontend if it exists ---
                    if exist "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movie-frontend" (
                        rmdir /S /Q "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movie-frontend"
                    )

                    REM --- Create new frontend folder in Tomcat ---
                    mkdir "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movie-frontend"

                    REM --- Copy build output ---
                    rem CORRECTED: Changed source from 'movie-frontend\\dist\\*' to 'frontendapp\\dist\\*'
                    xcopy /E /I /Y frontendapp\\dist\\* "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\movie-frontend"
                '''
            }
        }

        // ===== BACKEND BUILD =====
        stage('Build Backend') {
            steps {
                dir('BACKEND/movieapp') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        // ===== BACKEND DEPLOY =====
        stage('Deploy Backend to Tomcat') {
            steps {
                bat '''
                    if exist "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\MovieBackend.war" (
                        del "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\MovieBackend.war"
                    )
                    copy BACKEND\\movieapp\\target\\MovieBackend.war "C:\\Program Files\\Apache Software Foundation\\Tomcat 10.1\\webapps\\"
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully."
        }
        failure {
            echo "Pipeline Failed. Check folder names and logs."
        }
    }
}