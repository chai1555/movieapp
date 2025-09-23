package com.klef.dev;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class MovieappApplication extends SpringBootServletInitializer{

	public static void main(String[] args) {
		SpringApplication.run(MovieappApplication.class, args);
		System.out.println("Project is Running");
	}

}
