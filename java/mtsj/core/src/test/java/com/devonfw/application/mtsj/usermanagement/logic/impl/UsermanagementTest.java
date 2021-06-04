package com.devonfw.application.mtsj.usermanagement.logic.impl;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import javax.inject.Inject;
import javax.persistence.EntityExistsException;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.test.annotation.Rollback;

import com.devonfw.application.mtsj.SpringBootApp;
import com.devonfw.application.mtsj.dishmanagement.logic.api.Dishmanagement;
import com.devonfw.application.mtsj.general.common.ApplicationComponentTest;
import com.devonfw.application.mtsj.usermanagement.common.api.to.ResetTokenEto;
import com.devonfw.application.mtsj.usermanagement.common.api.to.ResetTokenMessageEto;
import com.devonfw.application.mtsj.usermanagement.common.api.to.UserCto;
import com.devonfw.application.mtsj.usermanagement.common.api.to.UserEto;
import com.devonfw.application.mtsj.usermanagement.dataaccess.api.ResetTokenEntity;
import com.devonfw.application.mtsj.usermanagement.dataaccess.api.UserEntity;
import com.devonfw.application.mtsj.usermanagement.dataaccess.api.repo.ResetTokenRepository;
import com.devonfw.application.mtsj.usermanagement.logic.api.Usermanagement;
import com.devonfw.application.mtsj.usermanagement.logic.impl.helperinterfaces.UsermanagementUtility;

/**
 * Tests for {@link Dishmanagement} component.
 *
 */
@SpringBootTest(classes = SpringBootApp.class)
public class UsermanagementTest extends ApplicationComponentTest {

	@Inject
	Usermanagement userManagement;
	
	@Inject
	UsermanagementUtility userManagementUtility;

	@Inject
	private ResetTokenRepository resetTokenDao;

	UserCto userCto;
	UserEto userEto;

	/**
	 * Creation of needed objects
	 */
	@Override
	public void doSetUp() {

		super.doSetUp();

		this.userCto = new UserCto();

		this.userEto = new UserEto();

		this.userEto.setUsername("Lucy");
		this.userEto.setPassword("12345");
		this.userEto.setUserRoleId(0L);
		this.userEto.setEmail("mail@mail.net");

		this.userCto.setUser(userEto);

	}

	@AfterEach
	public void after(TestInfo testInfo) {
		if (testInfo.getTags().contains("Skip")) {
			return;
		}

		this.userManagement.deleteUser(this.userManagement.findUserbyName("Lucy").getId());
	}

	
	/*
	 *  EDITING USERDETAILS
	 */
	
	
	/**
	 * Tests if an order is created
	 */
	@Test
	@Rollback(true)
	public void saveAnUser() {

		UserEto createdUser = this.userManagement.saveUser(this.userEto);
		assertThat(createdUser).isNotNull();
	}

	@Test
	@Rollback(true)
	public void changeUserMail() {

		UserEto createdUser = this.userManagement.saveUser(this.userEto);
		createdUser.setEmail("newEmail@web.de");
		UserEto result = this.userManagement.updateUser(createdUser);
		assertEquals("newEmail@web.de", result.getEmail());
	}

	@Test
	@Rollback(true)
	public void changeUserRole() {

		UserEto createdUser = this.userManagement.saveUser(this.userEto);
		createdUser.setUserRoleId(1L);
		;
		UserEto result = this.userManagement.updateUser(createdUser);
		assertEquals(1L, result.getUserRoleId());
	}

	@Test
	@Rollback(true)
	@Tag("Skip")
	public void changeUserName() {

		UserEto createdUser = this.userManagement.saveUser(this.userEto);
		createdUser.setUsername("Lilith");
		createdUser.setEmail("nmail@mail.com");
		UserEto result = this.userManagement.updateUser(createdUser);
		assertEquals("Lilith", result.getUsername());
	}

	@Test
	@Rollback(true)
	public void saveEmailTwice() {

		this.userManagement.saveUser(this.userEto);
		try {
			this.userManagement.saveUser(this.userEto);
		} catch (Exception e) {
			EntityExistsException ex = new EntityExistsException();
			assertThat(e.getClass()).isEqualTo(ex.getClass());
		}
	}

	/*
	 * RESET PASS
	 */
	
	@Test
	@Rollback(true)
	public void resetPasswordProcess() {

		// Request Reset-TOKEN
		this.userManagement.saveUser(this.userEto);
		ResetTokenMessageEto requestMessage = this.userManagement.resetPassword(this.userEto);
		assertEquals("Email sent.", requestMessage.getMessage());

		// SET NEW PW
		ResetTokenEto request = new ResetTokenEto();
		Long requesterId = this.userManagement.findUserbyName("Lucy").getId();
		request.setId(requesterId);
		ResetTokenEntity tokenEntity = resetTokenDao.findByUserId(requesterId);
		request.setToken(tokenEntity.getToken());
		request.setPassword("newPass");

		ResetTokenMessageEto successMessage = this.userManagement.changeForgetPassword(request);
		assertEquals("Your Password changed.", successMessage.getMessage());
	}

//	@Test
//	@Rollback(true)
//	public void resetPasswordProcessWithWrongToken() {
//		
//		// Request Reset-TOKEN
//		this.userManagement.saveUser(this.userEto);
//		ResetTokenMessageEto requestMessage = this.userManagement.resetPassword(this.userEto);
//		assertEquals("Email sent.", requestMessage.getMessage());
//		
//		// SET NEW PW
//		ResetTokenEto request = new ResetTokenEto();
//		Long requesterId = this.userManagement.findUserbyName("Lucy").getId();
//		request.setId(requesterId);
//		ResetTokenEntity tokenEntity = resetTokenDao.findByUserId(requesterId);	
//		request.setToken("WRONGTOKEN");
//		request.setPassword("newPass");
//		
//		ResetTokenMessageEto successMessage = this.userManagement.changeForgetPassword(request);
//		assertEquals("Given Token not bound to any Account", successMessage.getMessage());
//		
//		request.setToken(tokenEntity.getToken());
//		
//		this.userManagement.changeForgetPassword(request);
//		assertEquals("Your Password changed.", successMessage.getMessage());
//	}

	@Test
	@Rollback(true)
	@Tag("Skip")
	public void resetPasswordWithNotExistingMail() {

		ResetTokenMessageEto requestMessage = this.userManagement.resetPassword(this.userEto);
		assertEquals("Email adress not found.", requestMessage.getMessage());
	}

	@Test
	@Rollback(true)
	@Tag("Skip")
	public void resetPasswordWithNotExistingToken() {

		String proceedMessage = this.userManagement.validateToken("not_existing_token");
		assertEquals("failure", proceedMessage);
	}

//	@Test
//	@Rollback(true)
//	@Tag("Skip")
//	public void resetPasswordWithInvalidTime() {
//
//		ResetTokenEntity entity = new ResetTokenEntity();
//
//		entity.setCreationDate(Instant.now()
//				.minus(40,ChronoUnit.MINUTES));
//		entity.setToken("");
//		
//		boolean invalidTimeStamp = new UsermanagementImpl().checkTimeStampsForToken(entity);
//		
//		assertEquals(false, invalidTimeStamp);
//	}

	/*
	 * Send Mail Test
	 */
	
	@Test
	@Rollback(true)
	@Tag("Skip")
	public void sendStaticTokenMail() {

		ResetTokenEntity tokenEntity = new ResetTokenEntity();
		tokenEntity.setToken("JUNIT RESET TOKEN TEST ");
		UserEntity user = new UserEntity();
		user.setEmail("thdslKF442ob123dsadsaRSAK121@gmx.net");
				
		assertDoesNotThrow(() -> this.userManagementUtility.send_reset_mail(user, tokenEntity));
	}
	
	@Test
	@Rollback(true)
	@Tag("Skip")
	public void sendDynamicTokenMail() {

		ResetTokenEntity tokenEntity = new ResetTokenEntity();
		tokenEntity.setToken("JUNIT RESET TOKEN TEST ");
		UserEntity user = new UserEntity();
		user.setEmail("thdslKF442ob123dsadsaRSAK121@gmx.net");
				
		assertDoesNotThrow(() -> this.userManagementUtility.send_resettoken_mail(user, tokenEntity));
	}

	@Test
	@Rollback(true)
	@Tag("Skip")
	public void sendConfirmationMail() {

		ResetTokenEntity tokenEntity = new ResetTokenEntity();
		tokenEntity.setToken("JUNIT RESET TOKEN TEST ");
		UserEntity user = new UserEntity();
		user.setEmail("thdslKF442ob123dsadsaRSAK121@gmx.net");
				
		assertDoesNotThrow(() -> this.userManagementUtility.send_reset_confirmation(user));
	}
	
//	/*
//	 * Admin-Management
//	 */

	@Test
	@Rollback(true)
	@Tag("Skip")
	public void deleteUser() {				
		assertDoesNotThrow(() -> this.userManagement.deleteUser(4L));
	}
	
	@Test
	@Rollback(true)
	@Tag("Skip")
	public void deleteNonExistingUser() {				
		EmptyResultDataAccessException thrown = 
				assertThrows(EmptyResultDataAccessException.class, () -> this.userManagement.deleteUser(99L), "");
	}
	
	@Test
	@Rollback(true)
	@Tag("Skip")
	public void deleteUserAdmin() {				
		IllegalStateException thrown = 
				assertThrows(IllegalStateException.class, () -> this.userManagement.deleteUser(3L), "");
	}
	
}
