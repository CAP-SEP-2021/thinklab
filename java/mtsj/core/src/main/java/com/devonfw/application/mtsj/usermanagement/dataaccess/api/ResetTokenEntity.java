package com.devonfw.application.mtsj.usermanagement.dataaccess.api;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.devonfw.application.mtsj.general.dataaccess.api.ApplicationPersistenceEntity;
import com.devonfw.application.mtsj.usermanagement.common.api.ResetToken;

@Entity
@Table(name = "ResetToken")
public class ResetTokenEntity extends ApplicationPersistenceEntity implements ResetToken {
	
	private static final long serialVersionUID = 1L;
	
	private UserEntity user;
	
	private String token;
  	
	public void setUser(UserEntity user) {
		this.user = user;
	}

	@OneToOne
	@JoinColumn(name = "idUser")
	public UserEntity getUser() {
		return this.user;
	}

	@Override
	public String getToken() {
		return this.token;
	}

	@Override
	public void setToken(String token) {
		this.token = token;
	}
	

}
