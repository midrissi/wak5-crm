﻿//Creating the Lead classmodel.Lead = new DataClass("Leads");//Add Lead attributes.model.Lead.ID = new Attribute("storage", "long", "key auto");model.Lead.firstName = new Attribute("storage", "string", "btree");model.Lead.lastName = new Attribute("storage", "string", "btree");model.Lead.title = new Attribute("storage", "string", "btree");model.Lead.phone = new Attribute("storage", "string", "btree");model.Lead.fax = new Attribute("storage", "string", "btree");model.Lead.mobile = new Attribute("storage", "string", "btree");model.Lead.emailAccnt = new Attribute("storage", "string", "btree");model.Lead.street = new Attribute("storage", "string", "btree");model.Lead.city = new Attribute("storage", "string", "btree");model.Lead.state = new Attribute("storage", "string", "btree");model.Lead.zip = new Attribute("storage", "string", "btree");model.Lead.country = new Attribute("storage", "string", "btree");model.Lead.company = new Attribute("storage", "string", "btree");model.Lead.owner = new Attribute("relatedEntity", "User", "User"); // relation to the User class//Eventsmodel.Lead.events = {};//onInit()model.Lead.events.onInit = function() {	var myCurrentUser = currentUser(), // we get the user of the current session.		myUser = ds.User.find("ID = :1", myCurrentUser.ID);			if ((myCurrentUser !== null) && (myUser !== null)) {//if a user is logged in.				this.owner = myUser;	}		this.converted = false;}; //end - onInit().model.Lead.events.onRestrictingQuery = function() {	var myCurrentUser = currentUser(), // we get the user of the current session.		sessionRef = currentSession(), // Get session.		result;			result = ds.Lead.createEntityCollection(); //default to empty collection.		if (sessionRef.belongsTo("Administrator")) {		result = ds.Lead.all();	} else {		result = ds.Lead.query("owner.ID = :1", myCurrentUser.ID);	}		return result;} //end - onRestrictingQuery();