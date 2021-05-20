package com.devonfw.application.mtsj.general.service.impl.config;

import javax.inject.Inject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.devonfw.application.mtsj.general.common.base.AdvancedDaoAuthenticationProvider;
import com.devonfw.application.mtsj.general.common.base.JWTAuthenticationFilter;
import com.devonfw.application.mtsj.general.common.base.JWTLoginFilter;
import com.devonfw.application.mtsj.general.common.base.TwoFactorFilter;
import com.devonfw.application.mtsj.general.common.impl.security.BaseUserDetailsService;
import com.devonfw.application.mtsj.general.common.impl.security.twofactor.TwoFactorAuthenticationProvider;

/**
 * This type serves as a base class for extensions of the {@code WebSecurityConfigurerAdapter} and provides a default
 * configuration. <br/>
 * Security configuration is based on {@link WebSecurityConfigurerAdapter}. This configuration is by purpose designed
 * most simple for authentication based on Json Web Token.
 */
public abstract class BaseWebSecurityConfig extends WebSecurityConfigurerAdapter {

  @Value("${security.cors.enabled}")
  boolean corsEnabled = true;

  @Inject
  private BaseUserDetailsService userDetailsService;

  @Inject
  private PasswordEncoder passwordEncoder;

  @Bean
  public AdvancedDaoAuthenticationProvider advancedDaoAuthenticationProvider() {

    AdvancedDaoAuthenticationProvider authProvider = new AdvancedDaoAuthenticationProvider();
    authProvider.setPasswordEncoder(this.passwordEncoder);
    authProvider.setUserDetailsService(this.userDetailsService);
    return authProvider;
  }

  @Bean
  public TwoFactorAuthenticationProvider twoFactorAuthenticationProvider() {

    TwoFactorAuthenticationProvider authProvider = new TwoFactorAuthenticationProvider();
    authProvider.setPasswordEncoder(this.passwordEncoder);
    return authProvider;
  }

  @Inject
  private AdvancedDaoAuthenticationProvider advancedDaoAuthenticationProvider;

  @Inject
  private TwoFactorAuthenticationProvider twoFactorAuthenticationProvider;

  private CorsFilter getCorsFilter() {

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.addAllowedOrigin("*");
    config.addAllowedHeader("*");
    config.addAllowedMethod("OPTIONS");
    config.addAllowedMethod("HEAD");
    config.addAllowedMethod("GET");
    config.addAllowedMethod("PUT");
    config.addAllowedMethod("POST");
    config.addAllowedMethod("DELETE");
    config.addAllowedMethod("PATCH");
    source.registerCorsConfiguration("/**", config);
    return new CorsFilter(source);
  }

  /**
   * Configure spring security to enable login with JWT.
   */
  @Override
  public void configure(HttpSecurity http) throws Exception {

	http.headers().frameOptions().disable();
	  
    String[] unsecuredResources = new String[] { "/login", "/security/**", "/services/rest/login",
    "/services/rest/logout", "/services/rest/dishmanagement/**", "/services/rest/imagemanagement/**",
    "/services/rest/ordermanagement/v1/order", "/services/rest/bookingmanagement/v1/booking",
    "/services/rest/bookingmanagement/v1/booking/cancel/**",
    "/services/rest/bookingmanagement/v1/invitedguest/accept/**",
    "/services/rest/bookingmanagement/v1/invitedguest/decline/**",
    "/services/rest/ordermanagement/v1/order/cancelorder/**",
    /*
     * https://github.com/LillYttrium/sep-my-thai-star/commit/d5ef5244b2b5378157a8f5402727c3a7a5ba4205
     * Adding h2-compatibility
     */
    "/h2-console/***", "/h2-console/", "/h2-console",
    /*
     * https://github.com/LillYttrium/sep-my-thai-star/commit/8b5c8d117bf26f435da90eca5739a84806df1a35
     * Fixed password issue, adding urls for external testing via postman
     */
    "/services/rest/usermanagement/v1/user/",
    "/services/rest/usermanagement/v1/user/*",
    "/services/rest/usermanagement/v1/user/**",
    
    "/services/rest/usermanagement/v1/user/search",
    /*
     * from capgimini
     */
    "/services/rest/bookingmanagement/v1/booking/",
    "/services/rest/bookingmanagement/v1/booking/*",
    "/services/rest/bookingmanagement/v1/booking/**",
    /*
     * for external testing via postman to updating payment status and booking status
     * https://github.com/LillYttrium/sep-my-thai-star/commit/e2eb0e698515c84b9d7b86e69b6df5ba6239009c
     */
    "/services/rest/bookingmanagement/v1/bookingupdate/",
    "/services/rest/bookingmanagement/v1/bookingupdate/*",
    "/services/rest/bookingmanagement/v1/bookingupdate/**",
    /*
     * for external testing via postman to update order status
     * https://github.com/LillYttrium/sep-my-thai-star/commit/d63ed9b2261ca1dd727d69318c2a8b49bb6090c3
     */
    "/services/rest/ordermanagement/v1/order/status/update/",
    "/services/rest/ordermanagement/v1/order/status/update/*",
    "/services/rest/ordermanagement/v1/order/status/update/**",
    /*
     * for external testing via postman for canceled states
     */
    "/services/rest/ordermanagement/v1/order/cancelorder/*/",
    "/services/rest/ordermanagement/v1/order/cancelorder/**/",
    "/services/rest/ordermanagement/v1/order/cancelorder/**",
    
    "/services/rest/ordermanagement/v1/order/*", "/services/rest/ordermanagement/v1/order/**",
    "/services/rest/ordermanagement/v1/order/archived","/services/rest/ordermanagement/v1/order/archived/",
    /*
     * for external testing with delete, add and update orderline via postman
     */
    "/services/rest/ordermanagement/v1/orderline/*/", "/services/rest/ordermanagement/v1/order/**",
    "/services/rest/ordermanagement/v1/orderline/", "/services/rest/ordermanagement/v1/orderline",
    
    "/services/rest/ordermanagement/v1/orderline/update","/services/rest/ordermanagement/v1/orderline/update/",
    
    "/services/rest/usermanagement/v1/user/update/",
    
    "/services/rest/usermanagement/v1/user/reset/password/request/",
    "/services/rest/usermanagement/v1/user/reset/password/new/",
    "/services/rest/usermanagement/v1/user/reset/password/validate/**"
    };
    
    http.userDetailsService(this.userDetailsService).csrf().disable().exceptionHandling().and().sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().authorizeRequests()
        .antMatchers(unsecuredResources).permitAll().antMatchers(HttpMethod.POST, "/login").permitAll().anyRequest()
        .authenticated().and()
        // verification with OTP are filtered with the TwoFactorFilter
        .addFilterBefore(new TwoFactorFilter("/verify", authenticationManager(), this.userDetailsService),
            UsernamePasswordAuthenticationFilter.class)
        // the api/login requests are filtered with the JWTLoginFilter
        .addFilterBefore(new JWTLoginFilter("/login", authenticationManager(), this.userDetailsService),
            UsernamePasswordAuthenticationFilter.class)
        // other requests are filtered to check the presence of JWT in header
        .addFilterBefore(new JWTAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

    if (this.corsEnabled) {
      http.addFilterBefore(getCorsFilter(), CsrfFilter.class);
    }

  }

  @Override
  @SuppressWarnings("javadoc")
  public void configure(AuthenticationManagerBuilder auth) throws Exception {

    auth.authenticationProvider(this.advancedDaoAuthenticationProvider)
        .authenticationProvider(this.twoFactorAuthenticationProvider);
  }
}
