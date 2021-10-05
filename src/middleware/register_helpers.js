const hbs = require("hbs");
const { handlebars } = require("hbs");

// block /delete according to the admin power
hbs.registerHelper("block", (value,blockstatus, id)=>{
    if(value == 1){
        if(blockstatus == 1){
            return new handlebars.SafeString(`<a class="btn btn-warning m-1" confirm('are you sure to unblock this user?')  href="/admin/unblockuser/${id}" ><i class="fa fa-key pr-2" aria-hidden="true"></i> Unblock</a>`)
        }
        else{
            return new handlebars.SafeString(`<a  class="btn btn-danger m-1" confirm('are you sure to delete this user?') href="/admin/deleteuser/${id}" ><i class="fa fa-ban pr-2" aria-hidden="true"></i> Delete</a>`)
        }
        
    }
    else{
        if(blockstatus == 0){
            return new handlebars.SafeString(`<a class="btn btn-danger m-1" confirm('are you sure to block this user?') href="/admin/blockuser/${id}" ><i class="fa fa-ban pr-2" aria-hidden="true"></i> Block</a>`)
        }
        else{
            return new handlebars.SafeString(`<a  class="btn btn-warning m-1" confirm('are you sure to unblock this user?') href="/admin/unblockuser/${id}" ><i class="fa fa-key pr-2" aria-hidden="true"></i> Unblock</a>`)
        }
        
    }
 });
 //idcard designation
 hbs.registerHelper("designation", (committee_designation)=>{
    if(committee_designation !=null){
        return committee_designation
    }
    else{
        return 'Member'
    }
});
 //voteOrView
hbs.registerHelper("voteOrView", (vote_status,com_id)=>{
    if(vote_status == 1){
        return new handlebars.SafeString(`<a class="btn btn-smx btn-primary ml-2" href="/users/voting/${com_id}">Go for Voting</a>`)
    }
});
 //Vote Result
 hbs.registerHelper("resultStatus", (result_status,com_id)=>{
    if(result_status == 1){
        return new handlebars.SafeString(`<a class="btn btn-sm btn-secondary mr-2" href="/users/singlecommitteeview/${com_id}">View</a>`)
    }
});
 //Voting Status active/deactivate
 hbs.registerHelper("voteActiveDeactive", (vote_status,com_id)=>{
    if(vote_status == 0){
        return new handlebars.SafeString(`<a id="dlt5" href="/admin/activevotingstatus/${com_id}"   class="btn btn-info btn-sm ml-1" title="Active Voting Status"><img style="width: 15px;" src="/images/fingerprint.png" alt="photo"></a>`)
    }
    else{
        return new handlebars.SafeString(`<a id="dlt5" href="/admin/deactivevotingstatus/${com_id}"   class="btn btn-info btn-sm ml-1" title="Deactive Voting Status"><img style="width: 15px;" src="/images/power-button.png" alt="photo"></a>`)
    }
});

//voting btn/active/dective
hbs.registerHelper("voteYesNo", (value)=>{
    
    if( value == true){
        return new handlebars.SafeString(`<button id="subBtnpresident" disabled type="submit" class="btn btn-secondary" ><i class="fa fa-check pr-2" aria-hidden="true"></i><span id="btn_text">Done</span></button>`)
    }
    else{
        return new handlebars.SafeString(`<button id="subBtnpresident" type="submit" class="btn btn-secondary" >Click for vote</button>`)
    }
 });
//  Active/deactive
hbs.registerHelper("activeDeactive", (value,id)=>{
    if(value == 1){
        return new handlebars.SafeString(`<a href="/admin/committeedeactivate/${id}" class="status-btn btn btn-danger btn-sm ml-1" title="Deactivate"><img class="img-fluid" style="width: 15px;" src="/images/disable.png" alt=""></a>`)
    }
    else{
        return new handlebars.SafeString(`<a href="/admin/committeeactive/${id}" class="status-btn btn btn-primary btn-sm ml-1" title="Activate"><i class="fa fa-check" aria-hidden="true"></i></a>`)
    }
 });
// user verified or not
hbs.registerHelper("verify", (value,id)=>{
    if(value == 1){
        return new handlebars.SafeString(`<button class="btn btn-primary m-1" disabled ><i class="fa fa-check-circle" aria-hidden="true"></i> Verified</button>`)
    }
    else{
        return new handlebars.SafeString(`<a href="/users/verify/${id}" class="btn btn-primary m-1">Verify</a>`)
    }
 });
 // user verified or not
hbs.registerHelper("nomination", (value,category,type,id)=>{
    if(value == false){
        return new handlebars.SafeString(`<a class="btn btn-sm btn-primary" href="/users/getnomination/${id}" >Nomination</a>`)
    }
    else{
        return new handlebars.SafeString(`<button style="cursor: not-allowed;" type="button" class="btn btn-sm btn-danger" disabled>You have been nominated</button>`)
    }
 });
  // nomination list according to their designation
hbs.registerHelper("designationlist", (value1,value2,nominationid,committee_id,name,userid,vote,del_status,attachment)=>{
    if(value1 == value2 && del_status == 0){
        return new handlebars.SafeString(`
        <div class="card border text-center">
          <div class="card-header d-flex justify-content-between">
              <b style="font-size: 10px;">${name}</b>
              
              <a onclick=" return confirm('Are you sure?')" class="btn btn-sm btn-danger" href="/admin/deletenomination/${nominationid}/${committee_id} " ><i class="far fa-times-circle"></i></a>
          </div>
          <span style="font-size: 10px; padding:6px;"></span>
          <div class="card-footer d-flex justify-content-between">
            <a class="btn btn-sm btn-outline-primary" href="/users/singleuserview/${userid}">Profile</a>
            <a onclick="displayDataIntoModal(${userid},'${name}','${value1}','${attachment}',${vote})" data-bs-toggle="modal" data-bs-target="#staticBackdrop" role="button" class="btn btn-readmore btn-info btn-sm">Details</a>
            
          </div>
        </div>`)
    }
    else if(value1 == value2){
        return new handlebars.SafeString(`
        <div class="card border text-center">
          <div class="card-header d-flex justify-content-between">
              <b style="font-size: 10px;">${name}</b>
              <a onclick=" return confirm('Are you sure?')" class="btn btn-sm btn-success text-light" href="/admin/movetonomination/${nominationid}/${committee_id} " title="move to nominationlist" ><i class="fa fa-check-circle" aria-hidden="true"></i></a>
          </div>
          <span style="font-size: 10px; padding:6px;"></span>
          <div class="card-footer d-flex justify-content-between">
            <a class="btn btn-sm btn-outline-primary" href="/users/singleuserview/${userid}">Details</a>
            <a class="btn btn-sm btn-info">Vote:${vote}</a>
            
          </div>
        </div>`)
    }
    

    
    // else{
    //     return new handlebars.SafeString(`<button style="cursor: not-allowed;" type="button" class="btn btn-sm btn-danger" disabled>You have been nominated</button>`)
    // }
 });
  // nomination list according to their designation
hbs.registerHelper("designationlistVote", (value1,value2,nominationid,committee_id,name,userid,vote,del_status,attachment)=>{
    if(value1 == value2){
        return new handlebars.SafeString(`
        <option value=${userid}>${name}</option>`)
    }
    
    
    
    
    // else{
    //     return new handlebars.SafeString(`<button style="cursor: not-allowed;" type="button" class="btn btn-sm btn-danger" disabled>You have been nominated</button>`)
    // }
 });
//6digit id
hbs.registerHelper("fixedDigit",(num,size)=>{
    var s = "00000000" + num;
    var value = s.substr(s.length-size);
    return s.substr(s.length-size);
})
// serial
hbs.registerHelper("counter", (value)=>{
   return value + 1;
})
// Notice date processing------------------
hbs.registerHelper("noticeDate",(value)=>{
    var date = new Date(value);
    var day = date.getDate(); 
    var month = date.getMonth(); 
    var year = date.getFullYear();
    var months = [ "Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sep", "Oct", "Novr", "Dec" ];
   var month_index =  months[month];


    return new handlebars.SafeString(`<div class="col-md-12 notice-date-left">
    <h4>${day}<span>${month_index}</span></h4>
    <div class="notice_year pull-in">
        <h4>${year}</h4>
    </div>
</div>`)
})
// display short string from a long string
hbs.registerHelper("blogShort", function(value){
    return value = value.substring(0,200);
 });

// custom shorter word
hbs.registerHelper("makeshorterWithNum", function(value,num){
    return value = value.substring(0,num);
 });
hbs.registerHelper("makeShortString", function(value){
   return value = value.substring(0,70);
});
// privacy
hbs.registerHelper("privacy", function(value, number){
    if(value == 1){
        return new handlebars.SafeString(`<span><i class="fa fa-lock">01*********</i></span>`)
    }else{
        return new handlebars.SafeString(`${number}`)
    }
})

// payment-status
hbs.registerHelper("role",(value)=>{
    if(value == 1){
        return new handlebars.SafeString(`<span style="font-size: 10px;border-radius:40px" class="bg-primary px-3 py-1 text-light font-bold">Super Admin</span>`)
    }
    else{
        return new handlebars.SafeString(`<span style="font-size: 10px;border-radius:40px" class="bg-success px-3 py-1 text-light font-bold">Secondary Admin</span>`)
    }

})

// payment-status
hbs.registerHelper("paymentStatus",(value)=>{
    if(value == 0){
        return new handlebars.SafeString(`<span style="font-size: 10px;border-radius:40px" class="bg-danger px-3 py-1 text-light font-bold">Pending</span>`)
    }
    else{
        return new handlebars.SafeString(`<span style="font-size: 10px;border-radius:40px" class="bg-success px-3 py-1 text-light font-bold">Done</span>`)
    }

})

// category-status
hbs.registerHelper("categoryStatus",(value)=>{
    if(value == 0){
        return new handlebars.SafeString(`<span style="font-size: 10px;border-radius:40px" class="bg-danger px-3 py-1 text-light font-bold">Deactivated</span>`)
    }
    else{
        return new handlebars.SafeString(`<span style="font-size: 10px;border-radius:40px" class="bg-success px-3 py-1 text-light font-bold">Active</span>`)
    }

});
// helper -register
hbs.registerHelper("navrole", function(value){
    if(value == 1){
        return new handlebars.SafeString(`<aside class="left-sidebar" data-sidebarbg="skin6">
        <!-- Sidebar scroll-->
        <div class="scroll-sidebar">
            <!-- Sidebar navigation-->
            <nav class="sidebar-nav">
                <ul id="sidebarnav">
                    <!-- User Profile-->
                    <li class="sidebar-item pt-2">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin"
                            aria-expanded="false">
                            <i class="far fa-clock" aria-hidden="true"></i>
                            <span class="hide-menu">admin</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                    <a class="sidebar-link waves-effect waves-dark sidebar-link" href="#profileCollapse" aria-expanded="false" data-bs-toggle="collapse" data-bs-target="#profileCollapse" 
                        aria-expanded="false">
                        <i class="fa fa-user" aria-hidden="true"></i>
                        <span class="hide-menu">Profile <span class="float-right"><i class="fa fa-angle-right" aria-hidden="true"></i></span></span>
                    </a>
                    <ul id="profileCollapse" class="collapse ml-2">
                        <li class="sidebar-item">
                            <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/users/profile">
                                <i class="fa fa-id-card" aria-hidden="true"></i>
                                <span class="hide-menu">My Profile</span>
                            </a>
                        </li>
                        <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            <i class="fa fa-id-card" aria-hidden="true"></i>
                            <span class="hide-menu">My Id Card</span>
                        </a>
                       </li>
                      </ul>
                    </li>
                    <li class="sidebar-item">
                        <a  data-bs-target="#collapsetwo" class="sidebar-link waves-effect waves-dark sidebar-link" aria-expanded="false" data-bs-toggle="collapse" href="#collapsetwo" 
                            aria-expanded="false">
                           <i class="fa fa-university" aria-hidden="true"></i>
                            <span class="hide-menu">Institutetion <span class="float-right"><i class="fa fa-angle-right" aria-hidden="true"></i></span></span>
                        </a>
                        <ul id="collapsetwo" class="pl-3 collapse">
                            <li class="sidebar-item">
                                <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/users/institutionlist">
                                    <i class="fa fa-id-card" aria-hidden="true"></i>
                                    <span class="hide-menu">Institution List</span>
                                </a>
                            </li>
                            <li class="sidebar-item">
                            <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/users/addinstitution" >
                                <i class="fa fa-university" aria-hidden="true"></i>
                                <span class="hide-menu">Add Institution</span>
                            </a>
                        </li>
                     </ul>
                    
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="#adminpaymentCollapse"
                            aria-expanded="false" data-bs-toggle="collapse" data-bs-target="#adminpaymentCollapse">
                            <i class="fa fa-credit-card" aria-hidden="true"></i>
                            <span class="hide-menu">Payment <span class="float-right"><i class="fa fa-angle-right" aria-hidden="true"></i></span></span>
                        </a>
                        <ul id="adminpaymentCollapse" class="pl-3 collapse">
                             <li class="sidebar-item">
                                <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/idcardpayment">
                                    <i class="fa fa-credit-card" aria-hidden="true"></i>
                                    <span class="hide-menu">ID Card Payment</span>
                                </a>
                            </li>
                            <li class="sidebar-item">
                                <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/membershippayment"
                                    aria-expanded="false">
                                   <i class="fa fa-credit-card" aria-hidden="true"></i>
                                    <span class="hide-menu">Membership Payment</span>
                                </a>
                            </li>
                            <li class="sidebar-item">
                                <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/eventpayment"
                                    aria-expanded="false">
                                   <i class="fa fa-credit-card" aria-hidden="true"></i>
                                    <span class="hide-menu">Event Payment</span>
                                </a>
                            </li>
                        </ul>
                     
                    </li>
                    <li class="sidebar-item">
                    <a class="sidebar-link waves-effect waves-dark sidebar-link" href="#userCollapse"
                        aria-expanded="false" data-bs-toggle="collapse" data-bs-target="#userCollapse">
                        <i class="fa fa-table" aria-hidden="true"></i>
                        <span class="hide-menu">Users <span class="float-right"><i class="fa fa-angle-right" aria-hidden="true"></i></span></span>
                    </a>
                    <ul id="userCollapse" class="pl-3 collapse">
                         <li class="sidebar-item">
                            <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/verifieduser">
                                <i class="fa fa-id-card" aria-hidden="true"></i>
                                <span class="hide-menu">Verified User</span>
                            </a>
                          
                        </li>
                        <li class="sidebar-item">
                            <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/newuserlist"
                                aria-expanded="false">
                               <i class="fa fa-credit-card" aria-hidden="true"></i>
                                <span class="hide-menu">New User</span>
                            </a>
                        </li>
                        <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/blockuserlist"
                            aria-expanded="false">
                           <i class="fa fa-credit-card" aria-hidden="true"></i>
                            <span class="hide-menu">Block User</span>
                        </a>
                    </li>
                    </ul>
                </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link"
                        href="#committeecollapse"
                        aria-expanded="false" data-bs-toggle="collapse" data-bs-target="#committeecollapse">
                             <i class="fa fa-users" aria-hidden="true"></i>
                            <span class="hide-menu">Committee <span class="float-right"><i class="fa fa-angle-right" aria-hidden="true"></i></span></span></span>
                        </a>
                        <ul id="committeecollapse" class="pl-3 collapse">
                         <li class="sidebar-item">
                            <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/addcommittee">
                                <i class="fa fa-id-card" aria-hidden="true"></i>
                                <span class="hide-menu">Add Committee</span>
                            </a>
                          
                        </li>
                        <li class="sidebar-item">
                            <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/committeelist"
                                aria-expanded="false">
                               <i class="fa fa-credit-card" aria-hidden="true"></i>
                                <span class="hide-menu">Committee List</span>
                            </a>
                        </li>
                    </ul>
                    </li>
                      <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/users/blood"
                            aria-expanded="false">
                            <i class="fa fa-fire" aria-hidden="true"></i>
                            <span class="hide-menu">Blood Donor</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/noticelist"
                            aria-expanded="false">
                            <i class="fa fa-bell" aria-hidden="true"></i>
                            <span class="hide-menu">Notice</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                    <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/bloglist"
                        aria-expanded="false">
                        <i class="fa fa-clock" aria-hidden="true"></i>
                        <span class="hide-menu">Blog</span>
                    </a>
                     </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="#membershipCollapse"
                        aria-expanded="false" data-bs-toggle="collapse" data-bs-target="#membershipCollapse">
                            <i class="fa fa-users" aria-hidden="true"></i>
                            <span class="hide-menu">Membership <span class="float-right"><i class="fa fa-angle-right" aria-hidden="true"></i></span></span>
                        </a>
                        <ul id="membershipCollapse" class="pl-3 collapse">
                            <li class="sidebar-item">
                                <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/createmembership">
                                    <i class="fa fa-id-card" aria-hidden="true"></i>
                                    <span class="hide-menu">Create Category</span>
                                </a>   
                            </li>
                            <li class="sidebar-item">
                                <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/membershipcategory"
                                    aria-expanded="false">
                                    <i class="fa fa-credit-card" aria-hidden="true"></i>
                                    <span class="hide-menu">Category</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link"
                        href="#settingscollapse"
                        aria-expanded="false" data-bs-toggle="collapse" data-bs-target="#settingscollapse">
                             <i class="fa fa-cog" aria-hidden="true"></i>
                            <span class="hide-menu">Settings <span class="float-right"><i class="fa fa-angle-right" aria-hidden="true"></i></span></span></span>
                        </a>
                        <ul id="settingscollapse" class="pl-3 collapse">
                        <li class="sidebar-item">
                            <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/admin-list">
                                <i class="fa fa-user" aria-hidden="true"></i>
                                <span class="hide-menu">Admin</span>
                            </a>
                          
                        </li>
                        <li class="sidebar-item">
                            <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/team">
                                <i class="fa fa-user" aria-hidden="true"></i>
                                <span class="hide-menu">Team</span>
                            </a>
                      
                        </li>
                        <li class="sidebar-item">
                            <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/"
                                aria-expanded="false">
                               <i class="fa fa-credit-card" aria-hidden="true"></i>
                                <span class="hide-menu">Others</span>
                            </a>
                        </li>
                    </ul>
                    </li>
                   
                     <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/eventlist"
                            aria-expanded="false">
                            <i class="fa fa-calendar" aria-hidden="true"></i>
                            <span class="hide-menu">Event</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/contactlist"
                            aria-expanded="false">
                            <i class="fa fa-envelope" aria-hidden="true"></i>
                            <span class="hide-menu">Contact Message</span>
                        </a>
                     </li>
                     <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/logout"
                            aria-expanded="false">
                            <i class="fa fa-info-circle" aria-hidden="true"></i>
                            <span class="hide-menu">logout</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <!-- End Sidebar navigation -->
        </div>
        <!-- End Sidebar scroll-->
      </aside>`)
    }else{
        return new handlebars.SafeString(`<aside class="left-sidebar" data-sidebarbg="skin6">
        <!-- Sidebar scroll-->
        <div class="scroll-sidebar">
            <!-- Sidebar navigation-->
            <nav class="sidebar-nav">
                <ul id="sidebarnav">
                    <!-- User Profile-->
                    <li class="sidebar-item pt-2">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/users"
                            aria-expanded="false">
                            <i class="far fa-clock" aria-hidden="true"></i>
                            <span class="hide-menu">Dashboard</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="#profileCollapse" aria-expanded="false" data-bs-toggle="collapse" data-bs-target="#profileCollapse" 
                            aria-expanded="false">
                            <i class="fa fa-user" aria-hidden="true"></i>
                            <span class="hide-menu">Profile <span class="float-right"><i class="fa fa-angle-right" aria-hidden="true"></i></span></span>
                        </a>
                        <ul id="profileCollapse" class="collapse ml-2">
                            <li class="sidebar-item">
                                <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/users/profile">
                                    <i class="fa fa-id-card" aria-hidden="true"></i>
                                    <span class="hide-menu">My Profile</span>
                                </a>
                            </li>
                            <li class="sidebar-item">
                            <a class="sidebar-link waves-effect waves-dark sidebar-link" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i class="fa fa-id-card" aria-hidden="true"></i>
                                <span class="hide-menu">My Id Card</span>
                            </a>
                           </li>
                        </ul>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="#paymentCollapse"
                            aria-expanded="false" data-bs-toggle="collapse" data-bs-target="#paymentCollapse">
                            <i class="fa fa-credit-card" aria-hidden="true"></i>
                            <span class="hide-menu">Payment <span class="float-right"><i class="fa fa-angle-right" aria-hidden="true"></i></span></span>
                        </a>
                        <ul id="paymentCollapse" class=" collapse ml-2">
                            
                          
                            <li class="sidebar-item">
                            <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/users/newpayment"
                                aria-expanded="false">
                               <i class="fa fa-user-plus" aria-hidden="true"></i>
                                <span class="hide-menu">New Payment</span>
                            </a>
                           </li>
                           <li class="sidebar-item">
                           <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/users/mypayment"
                               aria-expanded="false">
                              <i class="fa fa-list-ul" aria-hidden="true"></i>
                               <span class="hide-menu">My Paymentlist</span>
                           </a>
                       </li>
                        </ul>
                     
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/users/committeelist-user"
                            aria-expanded="false">
                             <i class="fa fa-users" aria-hidden="true"></i>
                            <span class="hide-menu">Committee</span>
                        </a>
                    </li>
                     <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/users/event"
                            aria-expanded="false">
                            <i class="fa fa-fire" aria-hidden="true"></i>
                            <span class="hide-menu">Events</span>
                        </a>
                    </li>
                      <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/users/blood"
                            aria-expanded="false">
                            <i class="fa fa-fire" aria-hidden="true"></i>
                            <span class="hide-menu">Blood Donor</span>
                        </a>
                    </li>
                     <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="check-reviews"
                            aria-expanded="false">
                            <i class="fa fa-clock" aria-hidden="true"></i>
                            <span class="hide-menu">Notice</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/admin/bloglist"
                            aria-expanded="false">
                            <i class="fa fa-clock" aria-hidden="true"></i>
                            <span class="hide-menu">Blog</span>
                        </a>
                     </li>
                                          
                     <li class="sidebar-item">
                        <a class="sidebar-link waves-effect waves-dark sidebar-link" href="/logout"
                            aria-expanded="false">
                            <i class="fa fa-info-circle" aria-hidden="true"></i>
                            <span class="hide-menu">logout</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <!-- End Sidebar navigation -->
        </div>
        <!-- End Sidebar scroll-->
</aside>`)
    }
})