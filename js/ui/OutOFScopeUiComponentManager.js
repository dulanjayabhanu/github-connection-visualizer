export class OutOfScopeUiComponentManager{
   // nested class for reference all the components of the privacy policy DOM
   static Policy = class{
      
      static lastUpdatedDate = document.getElementById("last-updated-date");
      static effectiveDate = document.getElementById("effective-date");
      
   };
   
   // nested class for reference all the components of the terms of use DOM
   static TermsOfUse = class{
    
    static lastUpdatedDate = document.getElementById("last-updated-date");
    static effectiveDate = document.getElementById("effective-date");

   };
}