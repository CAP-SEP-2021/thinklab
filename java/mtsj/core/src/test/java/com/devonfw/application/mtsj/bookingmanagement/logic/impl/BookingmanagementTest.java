package com.devonfw.application.mtsj.bookingmanagement.logic.impl;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

import javax.inject.Inject;
import javax.persistence.EntityNotFoundException;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import com.devonfw.application.mtsj.SpringBootApp;
import com.devonfw.application.mtsj.bookingmanagement.common.api.to.BookingCto;
import com.devonfw.application.mtsj.bookingmanagement.common.api.to.BookingEto;
import com.devonfw.application.mtsj.bookingmanagement.common.api.to.TableEto;
import com.devonfw.application.mtsj.bookingmanagement.common.api.to.findByCto;
import com.devonfw.application.mtsj.bookingmanagement.dataaccess.api.BookingEntity;
import com.devonfw.application.mtsj.bookingmanagement.dataaccess.api.TableEntity;
import com.devonfw.application.mtsj.bookingmanagement.dataaccess.api.repo.BookingRepository;
import com.devonfw.application.mtsj.bookingmanagement.logic.api.Bookingmanagement;
import com.devonfw.application.mtsj.general.common.ApplicationComponentTest;

// <=== Ab hier

/**
 * Tests for {@link Bookingmanagement} component.
 *
 */
@SpringBootTest(classes = SpringBootApp.class)
public class BookingmanagementTest extends ApplicationComponentTest {

	@Inject
	Bookingmanagement bookingManagement;
	
	@Inject
	private BookingRepository bookingDao;
	
	BookingCto bookingCto;
	BookingEto b;

	  @Override
	  public void doSetUp() {

	    super.doSetUp();
	    
	    BookingEto bookingEto = new BookingEto();
	    
	    bookingEto.setBookingDate(Instant.now());
//	    		.plus(5, ChronoUnit.HOURS)
//	    		.plus(10, ChronoUnit.MINUTES));
	    bookingEto.setName("Lilith");
	    bookingEto.setEmail("gemini@web.de");
	    bookingEto.setAssistants(2);
	    bookingEto.setTableId(0L);
	    
	    this.bookingCto = new BookingCto();
	    this.bookingCto.setBooking(bookingEto);
	  }
	  
		@AfterEach
		public void after(TestInfo testInfo) {
			if (testInfo.getTags().contains("Skip")) {
				return;
			}
		}

	@Test
	public void saveAnBooking() {

		BookingEto createdBooking = this.bookingManagement.saveBooking(this.bookingCto);
		assertThat(createdBooking).isNotNull();
		bookingDao.deleteById(createdBooking.getId());
	}
	
	@Test
	public void saveAnBookingWithToMuchGuests() {
		
		this.bookingCto.getBooking().setAssistants(9);	
		
		try {
			BookingEto createdBooking = this.bookingManagement.saveBooking(this.bookingCto);
			bookingDao.deleteById(createdBooking.getId());
		} catch (Exception e) {
			IllegalStateException ex = new IllegalStateException();
		    assertThat(e.getClass()).isEqualTo(ex.getClass());
		}		
	}
	
	@Test
	public void saveAnBookingWithInvalidDate() {		
		this.bookingCto.getBooking().setBookingDate(Instant.now().minus(10, ChronoUnit.HOURS));		
		try {
			BookingEto createdBooking = this.bookingManagement.saveBooking(this.bookingCto);
			bookingDao.deleteById(createdBooking.getId());
		} catch (Exception e) {
			IllegalStateException ex = new IllegalStateException();
		    assertThat(e.getClass()).isEqualTo(ex.getClass());
		}
	}
	
	@Test
	@Rollback(true)
	public void saveToMuchBookingNoTableLeft() {
		ArrayList<Long> savedBookings = new ArrayList<Long>();
		this.bookingCto.getBooking().setAssistants(8);
		try {
			IntStream.range(0, 99).forEachOrdered(n -> {
				BookingEto createdBooking = this.bookingManagement.saveBooking(this.bookingCto);
				savedBookings.add(createdBooking.getId());
			});
		} catch (Exception e) {
			IllegalStateException ex = new IllegalStateException();
		    assertThat(e.getClass()).isEqualTo(ex.getClass());
		} finally {
			for (Long id : savedBookings) {
				bookingDao.deleteById(id);
			}
		}
	}
	
	@Test
	@Rollback(true)
	public void saveBookingWithoutAssistantsShouldNotThrowError() {		

		BookingEto createdBooking = this.bookingManagement.saveBooking(this.bookingCto);	
		assertThat(createdBooking).isNotNull();
		bookingDao.deleteById(createdBooking.getId());
		
//		assertDoesNotThrow(() -> this.bookingManagement.saveBooking(this.bookingCto));		
	}
	
	@Test
	@Rollback(true)
	public void ALEXA_findClosestValidBooking() {
		
		// save booking
		BookingEto createdBooking = this.bookingManagement.saveBooking(this.bookingCto);
		
		// create findby
		findByCto findBy = new findByCto();		
		findBy.setBookingDate(Instant.now()
	    		.plus(10, ChronoUnit.MINUTES));
		findBy.setTableId(0L);
		
		// dont throw
		assertDoesNotThrow(() -> this.bookingManagement.findBy(findBy), "");
		bookingDao.deleteById(createdBooking.getId());

	}
	
	@Test
	@Rollback(true)
	public void ALEXA_findNoValidBookingByDate() {
		
		// save booking
		BookingEto createdBooking = this.bookingManagement.saveBooking(this.bookingCto);
		
		// create findby
		findByCto findBy = new findByCto();		
		findBy.setBookingDate(Instant.now()
	    		.minus(10, ChronoUnit.MINUTES));
		findBy.setTableId(0L);
		
		assertThrows(EntityNotFoundException.class, () -> this.bookingManagement.findBy(findBy), "");
		bookingDao.deleteById(createdBooking.getId());		
	}
	
	@Test
	@Rollback(true)
	public void ALEXA_setDeliveryBooking() {

		this.bookingCto.getBooking().setDelivery(true);
		
		BookingEto createdBooking = this.bookingManagement.saveBooking(this.bookingCto);		
		bookingDao.deleteById(createdBooking.getId());
		
		assertEquals(createdBooking.getDelivery(), true);
	}
	
	@Test
	@Rollback(true)
	public void ALEXA_setNullAssistantIsValid() {
		this.bookingCto.getBooking().setAssistants(null);		
		BookingEto createdBooking = this.bookingManagement.saveBooking(this.bookingCto);		
		bookingDao.deleteById(createdBooking.getId());		
	}

	
	
	
	
	
	
	
	
	
	
	
	
	
}
