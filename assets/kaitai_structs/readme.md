## What is this?

This folder contains a collection of Kaitai Structs for various vendor data formats that
appeared in the context of NoCloud.

Please note that these are provided as a reference and **not** to use them to autogenerate code for
NoCloud, because during testing, it has been discovered that said autogenerated code is more than
10 times slower than hand-crafted code, which is problematic,
since robot vacuums are embedded environments with very limited resources.

### What is Kaitai Struct?

Taken from the official website:

Kaitai Struct is a declarative language used to describe various binary data structures,
laid out in files or in memory: i.e. binary file formats, network stream packet formats, etc. 

http://kaitai.io

