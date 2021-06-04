package com.devonfw.application.mtsj.ordermanagement.logic.impl;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class OrdermanagementTestUtility {

	public static Pageable getPageable() {
		return new Pageable() {
			
			@Override
			public Pageable previousOrFirst() {
				return null;
			}
			
			@Override
			public Pageable next() {
				return null;
			}
			
			@Override
			public boolean hasPrevious() {
				return false;
			}
			
			@Override
			public Sort getSort() {
				return null;
			}
			
			@Override
			public int getPageSize() {
				return 1;
			}
			
			@Override
			public int getPageNumber() {
				return 0;
			}
			
			@Override
			public long getOffset() {
				return 0;
			}
			
			@Override
			public Pageable first() {
				return null;
			}
		};
	}
}
