package com.devonfw.mts.tests;

import org.junit.Test;
import org.junit.runner.RunWith;

import com.capgemini.mrchecker.test.core.BaseTest;
import com.capgemini.mrchecker.test.core.logger.BFLogger;
import com.devonfw.mts.common.data.Reservation;
import com.devonfw.mts.pages.ThaiBookPage;
import com.devonfw.mts.pages.ThaiConfirmBookPage;
import com.devonfw.mts.pages.ThaiHomePage;

import junitparams.JUnitParamsRunner;

@RunWith(JUnitParamsRunner.class)
public class TestsVisitor extends BaseTest {

  /** My thai star home page object */
  private ThaiHomePage myThaiStarHome;

  @Override
  public void setUp() {

    BFLogger.logInfo("Open thai home page before each test");
    this.myThaiStarHome = new ThaiHomePage();
    this.myThaiStarHome.load();

  }

  @Test
  public void Test_bookTable() {

    Reservation reservation = new Reservation("7/7/2021, 8:30 PM", "TestVisitor", "thinklab@gmx.net", 5);
    reserveTable(reservation);
  }

  /** Make table reservation */
  private void reserveTable(Reservation reservation) {

    ThaiBookPage bookingPage = this.myThaiStarHome.clickBookTable();
    ThaiConfirmBookPage confirmationPage = bookingPage.enterBookingData(reservation);
    confirmationPage.confirmBookingData();
    bookingPage.checkConfirmationDialog();
  }

  @Override
  public void tearDown() {

    // TODO Auto-generated method stub

  }
}
