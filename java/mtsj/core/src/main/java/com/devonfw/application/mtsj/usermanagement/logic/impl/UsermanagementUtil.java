package com.devonfw.application.mtsj.usermanagement.logic.impl;

import com.devonfw.application.mtsj.usermanagement.dataaccess.api.ResetTokenEntity;
import com.devonfw.application.mtsj.usermanagement.dataaccess.api.UserEntity;

public interface UsermanagementUtil {
	
	abstract public String generate_token();

	public void send_reset_mail(UserEntity destination, ResetTokenEntity tokenEntity);
	
	public void send_reset_confirmation(UserEntity destination);
}
