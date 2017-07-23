__________________
MASHUP(pset8 cs50)
__________________

----------------------------------------
Project Completed By: SAGAR BANSAL
Second Generation, SophomoreS.in
SID : 2286
email : sagarbansal099@gmail.com
github username : sagban
----------------------------------------

-----------------------------------------------------------------------------------

How to run the website                                                          |
**********************                                                          |
                                                                                |
To run the website, type the following command in the terminal :                |
                                                                                |
        apache50 start ~/workspace/pset8/public                                 |                                           
        mysql50 restart                                                         |
                                                                                |
Then copy the following url and paste it in the browser :                       |
                                                                                |
        https://ide50-remarkbansal.cs50.io                                      |
                                                                             
----------------------------------------------------------------------------------
About this Project
******************                                                              

Objectives:
Introduction to JavaScript, Ajax, JSON.
Exposure to objects and methods.
Grapple with realworld
APIs and libraries.            

-----------------------------------------------------------------------------------
About various files and directories                                         
***********************************                                         
                                                                            
All the content of the website is in the 'make-website/bayside' folder.

*import
    Navigate your way to ~/workspace/pset8/bin and open up import.
    PHP script that iterates over the lines in US.txt , INSERT ing data from each into places , that MySQL
    table.
    
*index.html
    Next navigate your way to ~/workspace/pset8/public and open up index.html .
    If you look at the page’s head, you’ll see all those CSS and JavaScript libraries we’ll be using (plus some others).
    Included in HTML comments are URLs for each library’s documentation.
    Next take a look at the page’s body , inside of which is div with a unique id of map‐canvas . It’s into that div that we’ll be
    injecting a map. Below that div , meanwhile, is a form , with a unique id of q that use to take input from users.
    
    
*styles.css
    Now navigate your way to ~/workspace/pset8/public/css and open up styles.css .
    In there is a bunch of CSS that implements the mashup’s UI.
    
    
*scripts.js
    Navigate next to ~/workspace/pset8/public/js and open up scripts.js .
    It’s this file that implements the mashup’s "frontend" UI, relying on Google Maps.
    Let’s walk through this one.

    -addMarker
        This function is need to add a marker (i.e., icon) to the map.
        
    -configure
        This function, meanwhile, picks up where that anonymous function left off.
        Within this function a number of "listeners," specifying what should happen when we "hear" certain events.
        For instance,
        Listen for a dragend event on the map, calling the anonymous function provided . That
        anonymous function, meanwhile, simply calls update (another function we’ll soon see). Per
        https://developers.google.com/maps/documentation/javascript/reference#Map
        dragend is "fired" (i.e., broadcasted) "when the user stops dragging the map."
        Similarly do we listen for zoom_changed , which is fired "when the map zoom property changes" (i.e., the user zooms in or out).
        On the other hand, upon hearing dragstart , we ultimately call removeMarkers so that all markers disappear temporarily as a user
        drags the map, thereby avoiding the appearance of a flicker that might otherwise happen as markers are removed and then readded
        after the maps bounds (i.e., corners) have changed.
        
    -hideInfo
        This one just calls close on our global info window.
    
    -removeMarkers
        Ultimately, this function is need to remove any and all markers from the map!
        
    -search
        This function is called by the typeahead plugin every time the user changes the mashup’s text box, as by typing or deleting a
        character. The value of the text box (i.e., whatever the user has typed in total) is passed to search as query . And the plugin also
        passes to search a second argument, cb , a "callback" which is a function that search should call as soon as it’s done searching
        for matches. In other words, this passing in of cb empowers search to be "asynchronous," whereby it will only call cb as soon as
        it’s ready, without blocking any of the mashup’s other functionality. Accordingly, search uses jQuery’s getJSON method to contact
        search.php asynchronously, passing in one parameter, geo , the value of which is query . Once search.php responds (however
        many milliseconds or seconds later), the anonymous function passed to done will be called and passed data , whose value will be
        whatever JSON that search.php has emitted. (Though if something goes wrong, fail is instead called.) Finally called is cb , to
        which search passes that same data so that the plugin can iterate over the places therein (assuming search.php found matches)
        in order to update the plugin’s dropdown.
        This function opens the info window at a particular marker with particular content (i.e., HTML).
        
    -update
        Last up is update , which first determines the map’s current bounds, the coordinates of its topright
        (northeast) and bottomleft (southwest) corners.
        It then passes those coordinates to update.php via a GET request to parse and extract latitudes and longitudes
        from these parameters.
        
    
    
*update.php
    Now navigate your way to ~/workspace/pset8/public and open up update.php . 
    Ah, okay, here’s the "backend" script that outputs a JSON array of up to 10 places (i.e., cities) that fall within
    the specified bounds (i.e., within the rectangle defined by those corners).
    Of particular interest should be preg_match , which allows you to compare strings against "regular expressions."
    Two calls to preg_match in update.php are simply ensuring that both sw and ne are commaseparated latitudes and
    longitudes.
    

*search.php
    Next open up search.php . Which outputs a JSON array of objects, each of which represents a row from places that
    somehow matches the value of geo . The value of geo , passed into search.php as a GET parameter, meanwhile, might be a city,
    state, and/or postal code.


*articles.php
    Now open up articles.php . It expects a GET parameter called geo , which it passes to lookup (which is defined in helpers.php ) for localized news, thereafter returning a JSON array of objects, each of which
    has two keys: link and title. Which returns hust JSON arrays of articles!
    
    
config.php
    Navigate your way to ~/workspace/pset8/includes and open up config.php .
    It loads CS50’s PHP library, along with helpers.php .
    
    
helpers.php
    In this file, there is just one function, lookup . This Function lookup queries Google News for articles
    for a particular geography. It first get content from google news or onion news as RSS feed, then convert it into JSON array.


config.json
    Next open up config.json . Ah, for database called pset8 .

__________________________________________________________________________________________________
--------------------------------------------------------------------------------------------------        
*   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *  *    *   *   *   *   *   *   *
--------------------------------------------------------------------------------------------------
__________________________________________________________________________________________________

Readme for GeoNames Postal Code files :

allCountries.zip: all countries, for the UK only the outwards codes, the UK total codes are in GB_full.csv.zip 
GB_full.csv.zip the full codes for the UK, ca 1.7 mio rows
<iso countrycode>: country specific subset also included in allCountries.zip
This work is licensed under a Creative Commons Attribution 3.0 License.
This means you can use the dump as long as you give credit to geonames (a link on your website to www.geonames.org is ok)
see http://creativecommons.org/licenses/by/3.0/
UK (GB_full.csv.zip): Contains Royal Mail data Royal Mail copyright and database right 2017.
The Data is provided "as is" without warranty or any representation of accuracy, timeliness or completeness.

This readme describes the GeoNames Postal Code dataset.
The main GeoNames gazetteer data extract is here: http://download.geonames.org/export/dump/


For many countries lat/lng are determined with an algorithm that searches the place names in the main geonames database 
using administrative divisions and numerical vicinity of the postal codes as factors in the disambiguation of place names. 
For postal codes and place name for which no corresponding toponym in the main geonames database could be found an average 
lat/lng of 'neighbouring' postal codes is calculated.
Please let us know if you find any errors in the data set. Thanks

For Canada we have only the first letters of the full postal codes (for copyright reasons)

For Ireland we have only the first letters of the full postal codes (for copyright reasons)

For Malta we have only the first letters of the full postal codes (for copyright reasons)

The Argentina data file contains 4-digit postal codes which were replaced with a new system in 1999.

For Brazil only major postal codes are available (only the codes ending with -000 and the major code per municipality).

The data format is tab-delimited text in utf8 encoding, with the following fields :

country code      : iso country code, 2 characters
postal code       : varchar(20)
place name        : varchar(180)
admin name1       : 1. order subdivision (state) varchar(100)
admin code1       : 1. order subdivision (state) varchar(20)
admin name2       : 2. order subdivision (county/province) varchar(100)
admin code2       : 2. order subdivision (county/province) varchar(20)
admin name3       : 3. order subdivision (community) varchar(100)
admin code3       : 3. order subdivision (community) varchar(20)
latitude          : estimated latitude (wgs84)
longitude         : estimated longitude (wgs84)
accuracy          : accuracy of lat/lng from 1=estimated to 6=centroid

----------------------------------------------------------------------------------
_____________________________________________________________________________________________

� SAGAR BANSAL2017

Other Projects in Submission : 
    
    * Bayside-Beat (bayside): See the README in Sites directory
    * Three Aces (CS75)  : See the README in CS75 directory
    * PriSag (My website): See the README in prisag directory
______________________________________________________________________________________________
