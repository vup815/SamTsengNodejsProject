exports.index = function(req, res) {
    if (req.session.view) {
        req.session.view ++;
        res.send(`View times : ${req.session.view}`);
    } else {
      req.session.view = 1;
      res.send('Welcome');
    }
}


