function main() {
	var $parents = Interface.locateParents();
	Interface.load($parents);
	Interface.whenClicked();
	if (PubMedPage.isPubMedAbstractPage()) {
		Abstract.highlight();
	}
}
