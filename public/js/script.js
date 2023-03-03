function onEditClick(id) {
  document.getElementById(id).classList.add('hidden');
  document.getElementById(id + '-edit').classList.remove('hidden');
}

function onCancelClick(id) {
  document.getElementById(id + '-edit').classList.add('hidden');
  document.getElementById(id).classList.remove('hidden');
}
