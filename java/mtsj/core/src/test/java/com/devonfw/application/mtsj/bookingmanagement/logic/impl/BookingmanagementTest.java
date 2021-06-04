package com.devonfw.application.mtsj.bookingmanagement.logic.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

import javax.inject.Inject;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Tags;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.test.annotation.Rollback;

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
	    bookingEto.setName("Lilith");
	    bookingEto.setEmail("gemini@web.de");
	    bookingEto.setAssistants(2);
	    
	    this.bookingCto = new BookingCto();
	    this.bookingCto.setBooking(bookingEto);
	    
	  }
	  
		@AfterEach
		public void after(TestInfo testInfo) {
			if (testInfo.getTags().contains("Skip")) {
				return;
			}
		}

	/**
	 * Tests if an order is created
	 */
	@Test
	public void saveAnBooking() {

		BookingEto createdBooking = this.bookingManagement.saveBooking(this.bookingCto);
		assertThat(createdBooking).isNotNull();
	}
	
	@Test
	public void saveAnBookingWithToMuchGuests() {
		
		this.bookingCto.getBooking().setAssistants(9);	
		
		try {
			this.bookingManagement.saveBooking(this.bookingCto);
		} catch (Exception e) {
			IllegalStateException ex = new IllegalStateException();
		    assertThat(e.getClass()).isEqualTo(ex.getClass());
		}
	}
	
	@Test
	public void saveAnBookingWithInvalidDate() {
		
		this.bookingCto.getBooking().setBookingDate(Instant.now().minus(10, ChronoUnit.HOURS));
		
		try {
			this.bookingManagement.saveBooking(this.bookingCto);
		} catch (Exception e) {
			IllegalStateException ex = new IllegalStateException();
		    assertThat(e.getClass()).isEqualTo(ex.getClass());
		}
	}
	
	@Test
	@Rollback(true)
	//@Tag("DeleteTable")
	public void saveToMuchBookingNoTableLeft() {
		
		this.bookingCto.getBooking().setAssistants(8);
		
		try {
			IntStream.range(0, 99).forEachOrdered(n -> {
				this.bookingManagement.saveBooking(this.bookingCto);
			});			
		} catch (Exception e) {
			IllegalStateException ex = new IllegalStateException();
		    assertThat(e.getClass()).isEqualTo(ex.getClass());
		}
	}

}
