﻿//Creating the Contact classmodel.Contact = new DataClass("Contacts");//Add Contact attributes.model.Contact.ID = new Attribute("storage", "long", "key auto");model.Contact.firstName = new Attribute("storage", "string", "btree");model.Contact.firstName.addEventListener("onSet", wordCaps2);model.Contact.lastName = new Attribute("storage", "string", "btree");model.Contact.lastName.addEventListener("onSet", wordCaps2);model.Contact.title = new Attribute("storage", "string", "btree");model.Contact.phone = new Attribute("storage", "string", "btree");model.Contact.fax = new Attribute("storage", "string");model.Contact.mobile = new Attribute("storage", "string", "btree");model.Contact.homePhone = new Attribute("storage", "string");model.Contact.leadSource = new Attribute("storage", "string");model.Contact.emailAccnt = new Attribute("storage", "string");model.Contact.skypeAccnt = new Attribute("storage", "string");model.Contact.assistant = new Attribute("storage", "string");model.Contact.reportsTo = new Attribute("storage", "string");model.Contact.accountNameTemp = new Attribute("storage", "string");model.Contact.street = new Attribute("storage", "string", "btree");model.Contact.city = new Attribute("storage", "string", "btree");model.Contact.state = new Attribute("storage", "string", "btree");model.Contact.zip = new Attribute("storage", "string", "btree");model.Contact.country = new Attribute("storage", "string", "btree");model.Contact.shippingStreet = new Attribute("storage", "string");model.Contact.shippingCity = new Attribute("storage", "string");model.Contact.shippingState = new Attribute("storage", "string");model.Contact.shippingZip = new Attribute("storage", "string");model.Contact.shippingCountry = new Attribute("storage", "string");model.Contact.company = new Attribute("storage", "string");model.Contact.fullName = new Attribute("calculated", "string");model.Contact.owner = new Attribute("relatedEntity", "User", "User"); // relation to the User classmodel.Contact.activityCollection = new Attribute("relatedEntities", "Activity", "contact", {reversePath:true});model.Contact.account = new Attribute("relatedEntity", "Account", "Account"); // relation to the Account classmodel.Contact.noteCollection = new Attribute("relatedEntities", "Note", "contact", {reversePath:true});model.Contact.collectionMethods = {};model.Contact.collectionMethods.changeOwner = function(paramObj) {		if (!currentSession().belongsTo("Manager")) {return "You do not have permission to change the owner of a contact.";}		var currentContactsCollection = this, //"this" contains our current company collection.		myUser = ds.User.find("ID = :1", paramObj.ownerID);			if (myUser !== null) {		//Note: Bug Report.		/*		paramObj.leadsSelectionArr.forEach(function(rowNum) { 			debugger;				currentLeadsCollection[rowNum].owner = myUser;			currentLeadsCollection[rowNum].save();		});		*/				var sessionRef = currentSession(); // Get session.		var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.						var count = 0;		currentContactsCollection.forEach(function(oneContact) {			if (paramObj.contactsSelectionArr.indexOf(count) !== -1) {								var recentItem = ds.RecentItem.find("dataClassName == :1 && entityKey == :2", "contacts", oneContact.ID);				if (recentItem) {					recentItem.remove();				}												oneContact.owner = myUser;				oneContact.save();							}			count++;		});				sessionRef.unPromote(promoteToken); //put the session back to normal. 	}		return "The owner has been changed.";};model.Contact.collectionMethods.changeOwner.scope = "public";//Dave Terry//model.Contact.firstName.events = {};//model.Contact.firstName.events.onSet = wordCaps;//model.Contact.lastName.events.onSet = wordCaps;//Calculated Attributes.model.Contact.fullName.onGet = function() {	return this.firstName + " " + this.lastName; };//Eventsmodel.Contact.events = {};model.Contact.events.onInit = function() {	var myCurrentUser = currentUser(), // we get the user of the current session.		myUser = ds.User.find("ID = :1", myCurrentUser.ID);			if ((myCurrentUser !== null) && (myUser !== null)) {//if a user is logged in.				this.owner = myUser;	}}; //end - onInit();model.Contact.events.onRestrictingQuery = function() {	var myCurrentUser = currentUser(), // we get the user of the current session.		sessionRef = currentSession(), // Get session.		result;			result = ds.Contact.createEntityCollection(); //default to empty collection.		if (sessionRef.belongsTo("Administrator") || sessionRef.belongsTo("Manager")) {		result = ds.Contact.all();	} else {		result = ds.Contact.query("owner.ID = :1", myCurrentUser.ID);	}		return result;}; //end - onRestrictingQuery();model.Contact.events.onSave = function() {	var existingAccount = null,		theNewAccount = null,		myCurrentUser = currentUser(), // we get the user of the current session.		myUser = ds.User.find("ID = :1", myCurrentUser.ID);		if (this.accountNameTemp) {			existingAccount = ds.Account.find("name = :1", this.accountNameTemp);			if (existingAccount) {			this.account = existingAccount;		} else {			theNewAccount = new ds.Account({name: this.accountNameTemp}).save();			theNewAccount.owner = myUser;			this.account = theNewAccount;			theNewAccount.contact = this;		}	} //end - if (this.accountNameTemp) .}; //end - onSave();