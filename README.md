ONLINE JS
========

Lightweight and reliable library to check internet connection status.

Compatible browsers: IE 8-11, Chrome, Firefox, Android, iOS


Usage
-----

Include this library into your project and just check is <code>window.onLine === true</code>.

Assign <code>window.onLineHandler</code> or <code>window.offLineHandler</code> functions to handle status changes.

Just look at <a href="http://pixelscommander.com/polygon/onlinejs/">example</a> (index.html in the repo)!

You can change <code>window.onLineURL</code> to point OnlineJS to your own server.

More info in this <a href="http://pixelscommander.com/en/javascript/onlinejs-javascript-internet-connection/">blog post</a>.


navigator.onLine
----------------

I`m often asked: “Why not just use navigator.onLine ?”. 
Using this property in critical tasks is bad idea. Property is underhandled and is not consistent among all browsers. It can show local connection status or react only on autonomous mode switching. Online JS is better way for serious project, it uses navigator.onLine and corresponding events as one of possible triggers and then makes more checks of internet connection.


Questions and propositions
--------------------------

Feel free to write me with any questions or propositions <a href="mailto:denis.radin@gmail.com">denis.radin@gmail.com</a>


Bug tracker
-----------

Have a bug? Please create an issue here on GitHub!

https://github.com/PixelsCommander/OnlineJS/issues


Twitter account
---------------

Keep up to date on announcements and more by following OnlineJS on Twitter, <a href="http://twitter.com/pixelscommander">@pixelscommander</a>.


License
---------------------

Copyright 2011 Denis Radin.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
