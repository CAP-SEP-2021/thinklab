package com.devonfw.application.mtsj.ordermanagement.common.api.to;

import java.util.ArrayList;

import com.devonfw.application.mtsj.ordermanagement.common.api.Order;
import com.devonfw.module.basic.common.api.to.AbstractEto;

/**
 * Entity transport object of Order
 */
public class OrderEto extends AbstractEto implements Order {

  private static final long serialVersionUID = 1L;

  private Long bookingId;

  private Long invitedGuestId;

  private String bookingToken;
  
  private String status;
  
  private boolean canceled;
  
  private boolean archived;

  private ArrayList<String> available_status = new ArrayList<String>() {{
	  add(new String("Order placed"));
	  add(new String("Food is prepared"));
	  add(new String("Food is delivered"));
	  add(new String("Paid"));
  }};
  
  /**
   * @return bookingToken
   */
  public String getBookingToken() {

    return this.bookingToken;
  }

  /**
   * @param bookingToken new value of {@link #getbookingToken}.
   */
  public void setBookingToken(String bookingToken) {

    this.bookingToken = bookingToken;
  }

  private Long hostId;

  @Override
  public Long getBookingId() {

    return this.bookingId;
  }

  @Override
  public void setBookingId(Long bookingId) {

    this.bookingId = bookingId;
  }

  @Override
  public Long getInvitedGuestId() {

    return this.invitedGuestId;
  }

  @Override
  public void setInvitedGuestId(Long invitedGuestId) {

    this.invitedGuestId = invitedGuestId;
  }

  
  
//  @Override
//  public int hashCode() {
//
//    final int prime = 31;
//    int result = super.hashCode();
//
//    result = prime * result + ((this.bookingId == null) ? 0 : this.bookingId.hashCode());
//    result = prime * result + ((this.status == null) ? 0 : this.status.hashCode());
//    result = prime * result + ((this.invitedGuestId == null) ? 0 : this.invitedGuestId.hashCode());
//
//    return result;
//  }
//
//  @Override
//  public boolean equals(Object obj) {
//
//    if (this == obj) {
//      return true;
//    }
//    if (obj == null) {
//      return false;
//    }
//    // class check will be done by super type EntityTo!
//    if (!super.equals(obj)) {
//      return false;
//    }
//    OrderEto other = (OrderEto) obj;
//
//    if (this.bookingId == null) {
//      if (other.bookingId != null) {
//        return false;
//      }
//    } else if (!this.bookingId.equals(other.bookingId)) {
//      return false;
//    }
//    
//    if (!this.status.equals(other.status))
//        return false;
//      if (this.status == null) {
//        if (other.status != null)
//          return false;
//      }
//    
//
//
//    if (this.invitedGuestId == null) {
//      if (other.invitedGuestId != null) {
//        return false;
//      }
//    } else if (!this.invitedGuestId.equals(other.invitedGuestId)) {
//      return false;
//    }
//
//    return true;
//  }

  @Override
public int hashCode() {
	final int prime = 31;
	int result = 1;
	result = prime * result + (archived ? 1231 : 1237);
	result = prime * result + ((available_status == null) ? 0 : available_status.hashCode());
	result = prime * result + ((bookingId == null) ? 0 : bookingId.hashCode());
	result = prime * result + ((bookingToken == null) ? 0 : bookingToken.hashCode());
	result = prime * result + (canceled ? 1231 : 1237);
	result = prime * result + ((hostId == null) ? 0 : hostId.hashCode());
	result = prime * result + ((invitedGuestId == null) ? 0 : invitedGuestId.hashCode());
	result = prime * result + ((status == null) ? 0 : status.hashCode());
	return result;
}

@Override
public boolean equals(Object obj) {
	if (this == obj)
		return true;
	if (obj == null)
		return false;
	if (getClass() != obj.getClass())
		return false;
	OrderEto other = (OrderEto) obj;
	if (archived != other.archived)
		return false;
	if (available_status == null) {
		if (other.available_status != null)
			return false;
	} else if (!available_status.equals(other.available_status))
		return false;
	if (bookingId == null) {
		if (other.bookingId != null)
			return false;
	} else if (!bookingId.equals(other.bookingId))
		return false;
	if (bookingToken == null) {
		if (other.bookingToken != null)
			return false;
	} else if (!bookingToken.equals(other.bookingToken))
		return false;
	if (canceled != other.canceled)
		return false;
	if (hostId == null) {
		if (other.hostId != null)
			return false;
	} else if (!hostId.equals(other.hostId))
		return false;
	if (invitedGuestId == null) {
		if (other.invitedGuestId != null)
			return false;
	} else if (!invitedGuestId.equals(other.invitedGuestId))
		return false;
	if (status == null) {
		if (other.status != null)
			return false;
	} else if (!status.equals(other.status))
		return false;
	return true;
}

@Override
  public Long getHostId() {

    return this.hostId;
  }

  @Override
  public void setHostId(Long hostId) {

    this.hostId = hostId;
  }

	@Override
	public void setStatus(String status) {
		
		if(status==null) {
			this.status = "Order placed";
			return;
		}
		
		for(String av_status : available_status) {
			
			if(status.equals(av_status)) {
				
				this.status = av_status;
				return;
			}
		}
		
		this.status = "Order placed";
	}
	
	@Override
	public String getStatus() {
	
		return this.status;
	}

	@Override
	public boolean getCanceled() {
		return this.canceled;
	}

	@Override
	public void setCanceled(boolean canceled) {
		this.canceled = canceled;
	}

	@Override
	public boolean getArchived() {
		return this.archived;
	}

	@Override
	public void setArchived(boolean archived) {
		this.archived = archived;
	}

}
