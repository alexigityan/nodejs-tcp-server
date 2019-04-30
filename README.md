# nodejs-tcp-server
<b>Testing NodeJS TCP Server with core 'Net' module </b>

The client sends an integer, server returns the square.

Make sure you have NodeJS installed on your system.

Run the server from command line:
    node server <i>host</i> <i>port</i>
  
<i>host</i> and <i>port</i> are optional arguments, default values are 'localhost' and 8860
  
Run the client from command line:
  node client <i>host</i> <i>port</i>

Again, <i>host</i> and <i>port</i> are optional, need to change them only if you changed server arguments.

Client accepts positive and negative integers via command line, maximum size - 32 bit (treats them as unsigned to save space, since the sign doesnt matter for this particular calculation) 
Server responds with integers, up to 64-bit.

A simple handshake mechanism is in place to verify the connection target.

In some cases you might need to open the port from your firewall.

<b>Have fun</b>
