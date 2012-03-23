start
   = " " * additive:additive " "* { return additive; }
   / " " * "rgb" " " * "(" " " * r:additive 
                " " * "," " " * g:additive 
                " " * "," " " * b:additive 
	        " " * ")" " " * { return Shade.Colors.rgb(r, g, b); }
   / " " * "hcl" " " * "(" " " * h:additive 
                " " * "," " " * c:additive 
                " " * "," " " * l:additive 
	        " " * ")" " " * { return Shade.Colors.hcl(h, c, l); }

additive
   = left:multiplicative " " * "+" " " * right:additive { return Shade.add(left, right); }
   / left:multiplicative " " * "-" " " * right:additive { return Shade.sub(left, right); }
   / multiplicative

multiplicative
   = left:primary " " * "*" " " * right:multiplicative { return Shade.mul(left, right); }
   / left:primary " " * "/" " " * right:multiplicative { return Shade.div(left, right); }
   / left:primary " " * "%" " " * right:multiplicative { return Shade.mod(left, right); }
   / primary

primary
   = " "* "u" " "* { return u_parameter; }
   / " "* "v" " "* { return v_parameter; }
   / " "* "t" " "* { return t_parameter; }
   / " "* number:number " "* { return number; }
   / "(" " "* additive:additive " "* ")" { return additive; }
   / "cos" " " * "(" additive:additive ")" { return Shade.cos(additive); }
   / "sin" " " * "(" additive:additive ")" { return Shade.sin(additive); }
   / "tan" " " * "(" additive:additive ")" { return Shade.tan(additive); }
   / "cosh" " " * "(" additive:additive ")" { return Shade.cosh(additive); }
   / "sinh" " " * "(" additive:additive ")" { return Shade.sinh(additive); }
   / "tanh" " " * "(" additive:additive ")" { return Shade.tanh(additive); }
   / "pi" { return Math.PI; }

number
   = digits:('-'?[0-9]*"."[0-9]+) { return Shade(parseFloat(digits[0] + digits[1].join("") + "." + digits[3].join(""))); }
   / digits:('-'?[0-9]+) { var x= digits[0] + digits[1].join(""); return Shade(parseInt(x, 10)); }
