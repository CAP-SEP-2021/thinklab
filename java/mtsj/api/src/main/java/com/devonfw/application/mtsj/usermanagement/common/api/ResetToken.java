package com.devonfw.application.mtsj.usermanagement.common.api;

import com.devonfw.application.mtsj.general.common.api.ApplicationEntity;

public interface ResetToken extends ApplicationEntity {

	public String getToken();
	public void setToken(String token);
	
}
