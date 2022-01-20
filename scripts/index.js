const $recent = $("#recent");
const $item = $(".item");
const $search = $("#search");
const $button = $("#icon");
const $delete = $(".cancel");

const STORAGE_ID = "HaTFsB2hCn3tpwHP";

const RECENT_ITEM = (value) => {
  return `<p class="${"item"}"><span>${value}</span> <img class="${"cancel"}" src="${"assets/cancel.icon.svg"}" alt="${"cancel"}"></p>`;
};

const getInitialItems = () => {
  try {
    const value = localStorage.getItem(STORAGE_ID);
    if (value) return JSON.parse(value);
    else {
      localStorage.setItem(STORAGE_ID, JSON.stringify({ items: [] }));
      return { items: [] };
    }
  } catch (err) {
    return { items: [] };
  }
};

const RENDER_ITEMS = (items) => {
  items.forEach((item) => {
    if (item !== $search.val()) $recent.append(RECENT_ITEM(item));
  });
};

const addItem = () => {
  const db = JSON.parse(localStorage.getItem(STORAGE_ID));
  const item = $search.val();
  const mutation =
    db.items.includes(item) || item === "" ? db.items : [item, ...db.items];
  localStorage.setItem(STORAGE_ID, JSON.stringify({ items: mutation }));
};

$search.keypress((event) => {
  const keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == "13") addItem();
  $search.focusout();
});

$button.click(() => addItem());

$search.focus(() => {
  const db = getInitialItems();
  if (db.items.length > 0) {
    $("#search-component").css("border-radius", "25px 25px 0 0");
    $recent.css("display", "block");
    RENDER_ITEMS(db.items);
  }
});

$(document).mouseup(function (e) {
  if (
    $(e.target).closest("#search").length === 0 &&
    $(e.target).closest("#recent").length === 0
  ) {
    if ($(e.target).closest("#search").length !== 0) {
      $recent.children().remove();
    }
    $search.focusout();
    $recent.children().remove();
    $("#search-component").css("border-radius", "25px");
    $recent.css("display", "none");
  }
});

$(document).ready(() => {
  $("body").delegate(".item", "click", (event) => {
    $search.val($(event.currentTarget).children("span").text());
  });

  $("body").delegate(".item .cancel", "click", (event) => {
    const ITEM = $(event.currentTarget).parent().children("span").text();
    $(event.currentTarget).parent().remove();

    const db = JSON.parse(localStorage.getItem(STORAGE_ID));
    const mutation = db.items.filter((item) => item !== ITEM);
    localStorage.setItem(STORAGE_ID, JSON.stringify({ items: mutation }));
    $recent.children().text(item).remove();
  });
});
