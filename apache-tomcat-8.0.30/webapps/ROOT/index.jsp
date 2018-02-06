<%--
  Created by IntelliJ IDEA.
  User: Josh
  Date: 22/01/2016
  Time: 14:14
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title></title>
  </head>
  <body>
  <h1>Java Web App String Calculator, Josh Orton</h1>
  <p>Please enter an equation to be calculated, in the form '1 + 2 - 3 + 4'</p>
  <form action="MyServlet" method="GET">
   Equation: <input type="text" name="equation">
    <br />
    <input type="submit" value="Submit" />
    </form>
  </body>
</html>
