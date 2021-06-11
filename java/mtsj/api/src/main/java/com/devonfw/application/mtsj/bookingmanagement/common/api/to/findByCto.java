package com.devonfw.application.mtsj.bookingmanagement.common.api.to;

import java.time.Instant;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;

import com.devonfw.module.basic.common.api.to.AbstractCto;

public class findByCto extends AbstractCto {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@NotNull
	private Instant bookingDate;

	@NotNull
	private Long tableId;

	public Instant getBookingDate() {
		return bookingDate;
	}

	public void setBookingDate(Instant bookingDate) {
		this.bookingDate = bookingDate;
	}

	public Long getTableId() {
		return tableId;
	}

	public void setTableId(Long tableId) {
		this.tableId = tableId;
	}

}
