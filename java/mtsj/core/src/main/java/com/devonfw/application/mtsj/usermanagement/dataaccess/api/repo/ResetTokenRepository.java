package com.devonfw.application.mtsj.usermanagement.dataaccess.api.repo;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devonfw.application.mtsj.usermanagement.dataaccess.api.ResetTokenEntity;
import com.devonfw.module.jpa.dataaccess.api.data.DefaultRepository;

public interface ResetTokenRepository extends DefaultRepository<ResetTokenEntity> {

	@Query("SELECT resettoken FROM ResetTokenEntity resettoken" //
			+ " WHERE idUser = :id")
	ResetTokenEntity findByUserId(@Param("id") Long id);
	
	@Query("SELECT resettoken FROM ResetTokenEntity resettoken" //
			+ " WHERE token = :token")
	ResetTokenEntity findByToken(@Param("token") String token);
}