package com.devonfw.mts.tests;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;

import com.capgemini.mrchecker.test.core.logger.BFLogger;
import com.devonfw.mts.pages.ThaiHomePage;
import com.devonfw.mts.pages.ThaiLoginPage;
import com.devonfw.mts.pages.ThaiMenuPage;
import com.devonfw.mts.pages.ThaiSummaryPage;

/**
 * TODO Lilly This type ...
 *
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class TestCasesWaiter {

  private ThaiHomePage myThaiStarHome;

  private String wName = "waiter";

  private String wPassword = "waiter";

  /**
   * @throws java.lang.Exception
   */
  @Before
  public void setUp() throws Exception {

    BFLogger.logInfo("Open thai home page before each test");
    this.myThaiStarHome = new ThaiHomePage();
    this.myThaiStarHome.load();
  }

  /**
   * @throws java.lang.Exception
   */
  @After
  public void tearDown() throws Exception {

  }

  /**
   * Bestellung stornieren
   */
  @Test
  public void TF20W() {

    BFLogger.logInfo("execute TF-20-W...");
    LogInAsWaiter();
    ThaiMenuPage menuPage = this.myThaiStarHome.clickMenuButton();
    ThaiSummaryPage summaryPage = menuPage.clickFirstMenu();
    LogOut();
  }

  public void LogInAsWaiter() {

    ThaiLoginPage loginPage = this.myThaiStarHome.clickLogInButton();
    loginPage.enterCredentials(this.wName, this.wPassword);
    Assert.assertTrue("User " + this.wName + " not logged", this.myThaiStarHome.isUserLogged(this.wName));
  }

  public void LogOut() {

    if (this.myThaiStarHome.isUserLogged()) {
      this.myThaiStarHome.clickLogOutButton();
    }
  }

}
