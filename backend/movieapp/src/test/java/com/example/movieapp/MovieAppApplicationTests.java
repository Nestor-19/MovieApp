package com.example.movieapp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.junit.jupiter.Container;

@SpringBootTest
@Testcontainers
class MovieAppApplicationTests {

	@Container
  	static MongoDBContainer mongo = new MongoDBContainer("mongo:6.0.5");

	@DynamicPropertySource
	static void overrideMongoUri(DynamicPropertyRegistry registry) {
    	registry.add("spring.data.mongodb.uri", mongo::getReplicaSetUrl);
  	}

	@Test
	void contextLoads() {
	}

}
