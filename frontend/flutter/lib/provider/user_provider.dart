import 'package:flutter/material.dart';
import 'package:zenith/models/user_modal.dart';

class UserProvider extends ChangeNotifier {
  User _user = User(
    name: '',
    email: '',
    password: '',
    zenCoins: 0,
  );

  User get user => _user;

  void setUser(String user) {
    print(user);
    _user = User.fromJson(user);
    notifyListeners();
  }

  void setUserFromModel(User user) {
    _user = user;
    notifyListeners();
  }
}
