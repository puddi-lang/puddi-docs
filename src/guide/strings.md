# Strings and characters

## `Str`

`Str` is an immutable Unicode string. String literals use double quotes and interpolate expressions in braces; the expression's type must implement `Show`. A literal brace is written `\{` or `\}`.

```puddi
fn main() {
    let name = "Ada"
    let unread = 2
    print("hi {name}, you have {unread + 1} messages")
    print("a literal \{brace\}")
    print("tab\tnewline\\n quote\" smile \u{1F600}")
}
```

```text,output
hi Ada, you have 3 messages
a literal {brace}
tab	newline\n quote" smile 😀
```

Escapes are `\n` `\r` `\t` `\0` `\\` `\"` `\'` `\{` `\}` and `\u{...}`.

## No integer indexing

A `Str` cannot be indexed by an integer and has no `len()`, because "the length of a string" means different things: bytes, code points or user-visible characters. Ask for the one you mean:

```puddi
fn main() {
    let s = "héllo👋🏽"
    print("{s.utf8_len()} bytes")
    print("{s.chars().count()} code points")
    print("{s.graphemes().count()} graphemes")
}
```

```text,output
14 bytes
7 code points
6 graphemes
```

`chars()` iterates code points as `Char` values, and `graphemes()` iterates grapheme clusters (what a reader sees as one character) as `Str` values.

## Searching and slicing

Positions in a string are `StrIndex` values. They come from searching (`find`, `rfind`), from `start()` and `end()`, or from moving an index by code points with `advance(i, n)` and `next_index(i)`, and they are only valid for the string that produced them.

```puddi
fn main() {
    let line = "key=value"
    match line.find("=") {
        Some(i) -> {
            print(line.slice_to(i))
            let after = line.advance(i, 1).unwrap()
            print(line.slice_from(after))
        }
        None -> print("no =")
    }
    if let Some((k, v)) = line.split_once("=") {
        print("{k} -> {v}")
    }
}
```

```text,output
key
value
key -> value
```

## Common methods

```puddi
fn main() {
    let s = "  Hello, World  "
    let t = s.trim()
    print(t.to_lower())
    print("{t.contains("World")} {t.starts_with("He")} {t.ends_with("!")}")
    print(t.replace("World", "Puddi"))
    print("{"a,b,,c".split(",")}")
    print("{"one two  three".split_whitespace()}")
    print(["x", "y", "z"].join("-"))
    print("ab".repeat(3))
}
```

```text,output
hello, world
true true false
Hello, Puddi
["a", "b", "", "c"]
["one", "two", "three"]
x-y-z
ababab
```

Other methods include `lines`, `trim_start`, `trim_end`, `rfind`, `slice`, `is_empty`, `parse_int`, `parse_float` and `to_bytes`. `+` concatenates two strings.

## Building strings

Use `StrBuilder` to assemble a string piece by piece:

```puddi
fn main() {
    let b = StrBuilder.new()
    for i in 0..3 {
        b.push("item {i};")
    }
    b.push_char('!')
    print(b.to_str())
}
```

```text,output
item 0;item 1;item 2;!
```

## `Char`

A `Char` is a Unicode scalar value, written in single quotes: `'a'`, `'\n'`, `'\u{1F600}'`.

```puddi
fn main() {
    let c = 'q'
    print("{c.is_alpha()} {c.to_upper()} {c.to_u32()} {'7'.to_digit(10)}")
}
```

```text,output
true Q 113 Some(7)
```

Case mapping covers ASCII only in Puddi 0.1.
