---
title: Provide Internet to an isolated Machine via SSH
date: 19-03-2025 01:30:00
categories:
  - Red Team
  - AD Enumeration
  - pivot
  - SSH
  - Tunneling
tags:
  - Enumeration
  - Red
  - Team
  - CRTP
---

**Setup on Host A:**

1. Install proxy server Squid on Host A . By default Squid listens on port 3128.  
    `yum install squid`
2. Comment the `http_access deny all` then add `http_access allow all` in /etc/squid/squid.conf
3. If Host A itself uses some proxy say 10.140.78.130:8080 to connect to internet then also add that proxy to `/etc/squid/squid.conf` as follows:

```
refresh_pattern (Release|Packages(.gz)*)$ 0 20% 2880
cache_peer 10.140.78.130 parent 8080 0 no-query default
never_direct allow all
```

**Setup on Host B:**

4. Add the following entries to /etc/environment

```
export http_proxy=http://127.0.0.1:3129
export https_proxy=http://127.0.0.1:3129
```

5. `source /etc/environment`

Now our setup is complete.

**Creating SSH tunnel with Remote port forwarding**

6. Make sure the server is started on Host A (e.g. `sudo service squid start`).
    
7. Run the following SSH command from Host A  
    `ssh -R 3129:localhost:3128 user@HostB`
    
    If you want to make persistent SSH tunnel, you can use autossh as follows:  
    `autossh -M 20000 -f -NT -R 3129:localhost:3128 user@HostB`  
    For above autossh command to work, you should be having SSH Keys setup from HostA to HostB
    
8. This will allow Host B to access the internet through Host A.
    

**Checking the internet:**

9. Run the following command from Host B  
    `wget https://google.com`

**Traffic flow diagram** :

![](https://cdn.vkie.pro/ssh-pivot.jpg)


Reference - https://unix.stackexchange.com/questions/116191/give-server-access-to-internet-via-client-connecting-by-ssh
