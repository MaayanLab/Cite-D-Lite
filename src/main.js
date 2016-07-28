function main() {
	var $parents = Interface.locateParents();
	Interface.load($parents);
	Interface.whenClicked();
	Abstract.highlight();
}
