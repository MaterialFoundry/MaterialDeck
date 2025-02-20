# Linux Installation
Material Deck is officially only supported on Windows and MacOS, because there is no Stream Deck application available for Linux.<br>
While there have been attempts to create applications to control a Stream Deck from Linux, such as [streamdeck_ui](https://timothycrosley.github.io/streamdeck-ui/), there appear to be no applications that support plugins written for the official Stream Deck app.

It is possible to get it to work by running a the Stream Deck app on a Windows virtual machine.<br>

<div class="warning">
    <p class="header">Disclaimer</p>
    <p class="content">
        Running Material Deck like this is not ideal:<br>
        * Running a virtual machine is not exactly resource efficient, so performance might suffer.<br>
        * Following these instruction might or might not work for you. It is purely meant as a way to help you get started.<br>
        <br>
        No support is provided for installations like these.
    </p>
</div>

#### Important Notes

* Running a virtual machine is not exactly resource efficient, so performance might suffer.
* Following these instruction might or might not work for you. It is purely meant as a way to help you get started, and no support is provided.

## Installation
Following the instructions below allows you to use Foundry like normal on Linux, while the Stream Deck application runs on a virtual machine. It is also possible to run both Foundry and the Stream Deck application on the virtual machine, but these instructions do not cover that.

On Linux:

1. Download and install [VirtualBox and its Extension Pack](https://www.virtualbox.org/wiki/Downloads)
2. Download a [Windows 10 disk image](https://www.microsoft.com/software-download/windows10)
3. [Install the Windows 10 virtual machine](https://www.extremetech.com/computing/198427-how-to-install-windows-10-in-a-virtual-machine)
    * Tip 1: You don't have to fill in a product key during installation, you can skip it and do that later.
    * Tip 2: Microsoft wants you to log into a Microsoft account during installation, but you can bypass it by temporarily disconnecting from the internet, this will create a local account instead
4. Go to the virtual machine settings -> Network:
    1. Make sure 'Attached to' is set to 'NAT'
    2. Click 'advanced' and open 'Port Forwarding'
    3. Add a new port forwarding rule, set it to:
        * Protocol = TCP
        * Host IP = 127.0.0.1
        * Host Port = 3001
        * Guest IP = 10.0.2.15
        * Guest Port = 3001
5. Start the virtual machine
6. Connect the Stream Deck to your computer and configure VirtualBox to connect it to Windows:
    * 'Devices' -> 'USB' -> select the Stream Deck

On the Windows virtual machine:

1. Download and install the Stream Deck application
2. When the application opens, if all went well, the Stream Deck should connect to it (it'll display all black keys except for the default 'welcome' action). If that doesn't happen, you might have to configure VirtualBox to use USB2.0 or 3.0 (In the virtual machine settings: 'USB' -> select 2.0 or 3.0. You might have to restart the virtual machine)

You can now follow the rest of the [normal installation instructions](./installation.md).<br>
