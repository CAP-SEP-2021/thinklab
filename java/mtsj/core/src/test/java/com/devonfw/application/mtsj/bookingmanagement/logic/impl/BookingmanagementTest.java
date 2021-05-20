package com.devonfw.application.mtsj.bookingmanagement.logic.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import com.devonfw.application.mtsj.SpringBootApp;
import com.devonfw.application.mtsj.bookingmanagement.common.api.to.BookingCto;
import com.devonfw.application.mtsj.bookingmanagement.common.api.to.BookingEto;
import com.devonfw.application.mtsj.bookingmanagement.logic.api.Bookingmanagement;
import com.devonfw.application.mtsj.dishmanagement.common.api.to.CategoryEto;
import com.devonfw.application.mtsj.dishmanagement.common.api.to.DishCto;
import com.devonfw.application.mtsj.dishmanagement.common.api.to.DishEto;
import com.devonfw.application.mtsj.dishmanagement.common.api.to.DishSearchCriteriaTo;
import com.devonfw.application.mtsj.dishmanagement.dataaccess.api.IngredientEntity;
import com.devonfw.application.mtsj.dishmanagement.logic.api.Dishmanagement;
import com.devonfw.application.mtsj.general.common.ApplicationComponentTest;
import com.devonfw.application.mtsj.ordermanagement.common.api.to.OrderCto;
import com.devonfw.application.mtsj.ordermanagement.common.api.to.OrderEto;
import com.devonfw.application.mtsj.ordermanagement.common.api.to.OrderLineCto;
import com.devonfw.application.mtsj.ordermanagement.common.api.to.OrderLineEto;

/**
 * Tests for {@link Dishmanagement} component.
 *
 */
@SpringBootTest(classes = SpringBootApp.class)
public class BookingmanagementTest extends ApplicationComponentTest {

	@Inject
	Bookingmanagement bookingManagement;
	
	BookingCto bookingCto;
	
	/*
	 * {"booking":{"bookingDate":"2021-06-30T17:54:41.000Z",
	 * "name":"Lucy2","email":"thinklab@gmx.net","assistants":2}}
	 */
	
	  /**
	   * Creation of needed objects
	   */
	  @Override
	  public void doSetUp() {

	    super.doSetUp();
	    
	    BookingEto bookingEto = new BookingEto();
	    
	    bookingEto.setBookingDate(Instant.now()
	    		.plus(5, ChronoUnit.HOURS)
	    		.plus(10, ChronoUnit.MINUTES));
	    bookingEto.setName("Lilly");
	    bookingEto.setEmail("gemini@web.de");
	    bookingEto.setAssistants(2);
	    	    
	    this.bookingCto = new BookingCto();
	    this.bookingCto.setBooking(bookingEto);
	    
	  }

	/**
	 * Tests if an order is created
	 */
	@Test
	public void saveAnBooking() {

		BookingEto createdBooking = this.bookingManagement.saveBooking(this.bookingCto);
		assertThat(createdBooking).isNotNull();
	}

}
