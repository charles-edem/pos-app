This a POS App im doing and im using it to learn react with typescript and other frontend frameworks we just started with the form and submission to create a product

*Product Iventory Form and Card*
So for some time now i have worked on the form and validation to add a product, and now i have been able to build a card that will display the details from my form
The form was done by myself and i learnt to use react-hook forms and how data is being worked around forms
With the card i used AI and edited it to match my preferences but i understand everything and im going to learn everything

*Inventory page*
So for a while now i have been able to develop the inventory page and connecting the related components such as the product card, prodcut form and other related components. So weve been able to build other components such as summary card for reducing the repetition of code and dropdown component to address the native select issue in our JSX. We also did the following;
1. Exporting of products in an excel file
2. Search, sort and filter methods
3. Bulk selection and deletion
4. Summary card generation and calculations

*Report Page(Pending)*
Report page was created in the process so that users can have a central point of viewing history of data in the system and be able to control it from one place. So as times goes on we will add various report like features into the report page then later style the entire page for a better UX
We have moved the stock adjustments to the report page created an exportExcel component for the excel file download and added it to the stock adjustment for downloading excel files
There is more to come from the reports page buh for now this is it

*Order Page*
The order page is mainly for taking orders or sales and we have distributed it into four parts
1. The quick selection part where users can just do a quick selection for minor purchases making UX easy
2. A recent order history even though that will be accessible in the report page 
3. A sale form that will calculate all the numbers from day to day purchases
4. And a form for bulk purchases that require manual data entry
So we have official began the design of the orders page, we encoutered an issue of accessing the products array from the inventory to other pages. It was solved by establishing a product context file so that we can access the products array directly from the context file in all pages.
So with that we have styled the products card for the quick selection process and also created a swipe through component from swiping through cards.\
Ok so we have worked on the checkout page where we calculate the total and other calculations and they update in real time