import { Constant } from "../frames/globals/constant";
import { MainFrame } from "../frames/globals/main-frame";
import { SetStatement } from "../frames/statements/set-statement";
import { VariableDefStatement } from "../frames/statements/variable-def-statement";
import { Procedure } from "../frames/globals/procedure";
import { Function } from "../frames/globals/function";
import { FunctionMethod } from "../frames/class-members/function-method";
import { Enum } from "../frames/globals/enum";
import { Test } from "../frames/globals/test";
import { Class } from "../frames/globals/class";
import { Property } from "../frames/class-members/property";
import { Throw } from "../frames/statements/throw";
import { Call } from "../frames/statements/call";
import { Print } from "../frames/statements/print";
import { While } from "../frames/statements/while";
import { Repeat } from "../frames/statements/repeat";
import { For } from "../frames/statements/for";
import { Each } from "../frames/statements/each";
import { IfStatement } from "../frames/statements/if-statement";
import { Else } from "../frames/statements/else";
import { TryCatch } from "../frames/statements/try-catch";
import { CommentStatement } from "../frames/statements/comment-statement";
import { GlobalComment } from "../frames/globals/global-comment";
import { FileImpl } from "../frames/file-impl";
import { StatementSelector } from "../frames/statements/statement-selector";
import { Switch } from "../frames/statements/switch";
import { hash } from "../util";

export function T00_emptyFile() {
	const f = new FileImpl(hash);
	return f;
}

export function T01_helloWorld() {
	const f = new FileImpl(hash);
	var gs = f.getFirstGlobalSelector();
	const m = new MainFrame(f);
	f.addGlobalBefore(m,gs);
	var ss = m.getFirstStatementSelector();
	const comment = new CommentStatement(m);
	comment.text.setText(`My first program`);
	m.addStatementBefore(comment, ss);
	const pr = new Print(m);
	pr.expr.setText(`"Hello World!"`);
	m.addStatementBefore(pr, ss);
	return f;
}

export function T02_comments() {
	const f = new FileImpl(hash);
	var gs = f.getFirstGlobalSelector();
	const gc = new GlobalComment(f);
	gc.text.setText("Comment 1");
	f.addGlobalBefore(gc,gs);
	const m = new MainFrame(f);
	f.addGlobalBefore(m, gs);
	var ss = m.getFirstStatementSelector();
	const sc2 = new CommentStatement(m);
	sc2.text.setText("Comment 2");
	m.addStatementBefore(sc2, ss);
	return f;
}

export function T03_mainWithAllStatements(): FileImpl {
	const f = new FileImpl(hash);
	var gs = f.getFirstGlobalSelector();
	const m = new MainFrame(f);
	f.addGlobalBefore(m,gs);
	var ssm = m.getFirstStatementSelector();
	const v = new VariableDefStatement(m);
	m.addStatementBefore(v,ssm);
	const s = new SetStatement(m);
	s.name.setText("a");
	s.expr.setText("3 + 4");
	m.addStatementBefore(s,ssm);
	const t = new Throw(m);
	m.addStatementBefore(t,ssm);
	const ca = new Call(m);
	ca.proc.setText("signIn");
	ca.args.setText(`rwp, password`);
	m.addStatementBefore(ca,ssm);
	const pr = new Print(m);
	pr.expr.setText(`"Hello World!"`);
	m.addStatementBefore(pr,ssm);
	const w = new While(m);
	w.condition.setText("newGame");
	m.addStatementBefore(w,ssm);
	const r = new Repeat(m);
	r.condition.setText("score > 20");
	m.addStatementBefore(r,ssm);
	const for1 = new For(m);
	m.addStatementBefore(for1,ssm);
	for1.variable.setText("i");
	for1.from.setText("1");
	for1.to.setText("10");
	
	const ea = new Each(m);
	ea.variable.setText("letter");
	ea.iter.setText("Charlie Duke");
	m.addStatementBefore(ea,ssm);
	const if1 = new IfStatement(m);
    if1.condition.setText("y > 4");
	m.addStatementBefore(if1,ssm);
	const if2 = new IfStatement(m);
	m.addStatementBefore(if2,ssm);
    if2.condition.setText("y > 4");
	var ss2 = if2.getFirstStatementSelector();
	var el1 = new Else(if2);
	if2.addStatementBefore(el1,ss2);
	if2.addStatementBefore(new StatementSelector(if2), el1);
	const if3 = new IfStatement(m);
	m.addStatementBefore(if3, ssm);
	var ss_if3 = if3.getFirstStatementSelector();
    if3.condition.setText("y > 4");
	const el2 = new Else(if3);
	el2.hasIf = true;
	el2.condition.setText("y > 10");
	if3.addStatementBefore(el2,ss_if3);
	if3.addStatementBefore(new Else(if3),ss_if3);
	const tr = new TryCatch(m);
	m.addStatementBefore(tr,ssm);
	const sw = new Switch(m);
	m.addStatementBefore(sw,ssm);
	return f;
}

export function T07_mainWithAllStatementsSelectMainById(f : FileImpl) {
	f.getById("main1").select(true, false);
	return () => f;
}

export function T07_mainWithAllStatementsSelectStatementById(f : FileImpl) {
	f.getById("for22").select(true, false);
	return () => f;
}

export function T08_expandAll(f : FileImpl) {
	f.expandCollapseAll();
	return () => f;
}

export function T08_collapseAll(f : FileImpl) {
	f.expandCollapseAll();
	return () => f;
}

export function T04_allGlobalsExceptClass(): FileImpl {
	const f = new FileImpl(hash);
	var gs = f.getFirstGlobalSelector();
	const con = new Constant(f);
	con.name.setText("phi");
	con.literal.setText("1.618");
	f.addGlobalBefore(con, gs);
	const main = new MainFrame(f);
	f.addGlobalBefore(main, gs);
	const proc = new Procedure(f);
	proc.name.setText("signIn");
	f.addGlobalBefore(proc, gs);
	const func = new Function(f);
	func.name.setText("hypotenuse");
	func.params.setText("sideB Float, sideC Float");
	func.returnType.setText("Float");
	f.addGlobalBefore(func, gs);
	const enu = new Enum(f);
	enu.name.setText("Fruit");
	enu.values.setText("apple, orange, pear");
	f.addGlobalBefore(enu, gs);
	const test = new Test(f);
	test.name.setText("test1");
	f.addGlobalBefore(test, gs);
	return f;
}

export function T05_classes() {
	const f = new FileImpl(hash);
	var gs = f.getFirstGlobalSelector();
	const cl1 = new Class(f);
	var ms = cl1.getFirstMemberSelector();
	f.addGlobalBefore(cl1, gs);
	cl1.name.setText("Player");
	const p1 = new Property(cl1);
	cl1.addMemberAndSelectFirstField(p1,ms);
	p1.name.setText("score");
	p1.type.setText("Int");

	const cl2 = new Class(f);
	var ms2 = cl2.getFirstMemberSelector();
	cl2.inherits = true;
	cl2.superClasses.setText("Foo, Bar");
	f.addGlobalBefore(cl2, gs);
	cl2.name.setText("Card");
	cl2.immutable = true;
	const p2 = new Property(cl2);
	cl2.addMemberAndSelectFirstField(p2, ms2);
	p2.name.setText("value");
	p2.type.setText("Int");
	p2.private = true;
	const m1 = new FunctionMethod(cl2);
	cl2.addMemberAndSelectFirstField(m1,ms2);
	m1.name.setText("reset");
	m1.params.setText("");
	m1.returnType.setText("Player");
	return f;
}

/*
main
  var li set to {"plum","apricot","lime","lemon","melon","apple","orange","strawberry","pear","banana"}
  print mergeSort(li)
end main */

export function T09_emptyMainAndClassWithGlobalSelector() {
	const f = new FileImpl(hash);
	var gs = f.getFirstGlobalSelector();
	f.addGlobalBefore(new MainFrame(f), gs);
	f.addGlobalBefore(new Class(f), gs);
	return f;
}

export function getTestFrame(fn : string) : FileImpl {
	try {
    	return eval(`${fn}()`);
	}
	catch (e){
		return new FileImpl(hash);
	}
}
