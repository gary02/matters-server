exports.up = async (knex) => {
  // affect prod articles with id in (243998,262321,253780,262709,262585,262308,264186,263124,263668,265021,265465,268994,266555,267068,270498,265965,268372,267582,268126,268449,269981,269510,269294,270127,271473,270296,270958,274629,272220,273592,271769,272654,273154,273360,274074,274992,275036,275411,275909,276389,276046,276463,277421,276917,277425,277473,278627,277712,277905,278236,278033,279982,279524,279071,280941,280409,280942,281768,281276,280908,283634,282596,283018,282173,282228,282374,283452,283455,284594,284154,283836,283922,285028,389948,285432,311294,349943,359939,439395,439369,439370,420681,434821,439407,439410,439408,439415,439413,439412,439371,439414,439416,439368,439372,439375,439378,439380,439382,439383,439385,439386,439387,439388,439389,439390,439391,439392,439393,465682,439396,439397,439398,439400,439401,439405,453057,63347,469642,469640,57283,2554,29952,15420,154190,39433,39482,100932,40361,115292,122903,242266,184759,184812)
  await knex.raw(`
    UPDATE article_version SET title='未命名'
    WHERE id IN (
        SELECT avn.id FROM article_version_newest avn
        JOIN article a
            ON avn.article_id = a.id
        WHERE avn.title ~ '^[[:space:]\\u00a0\\u180e\\u2007\\u200b-\\u200f\\u202f\\u2060\\ufeff\\u3000]*$'
            AND state='active'
    );`)
}

exports.down = async () => {
  // do nothing
}
